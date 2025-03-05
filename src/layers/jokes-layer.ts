import { Contextual, Table, Visuals } from '../store-features';
import { createLayerModelBlock } from './create-layer-model';

interface Jokes {
  type: string;
  setup: string;
  punchline: string;
  id: number;
}

interface Dogs {
  message: string;
  status: string;
}

/**
 * A layer that displays a random joke from the official-joke-api and
 * a random dog image from dog.ceo.
 *
 * The layer displays the joke in a table with two columns, 'setup' and
 * 'punchline'. The layer also displays the dog image. If the request for
 * the joke fails, the layer displays the error message in red. If the
 * request is still loading, the layer displays 'Loading...' in grey.
 *
 * @publicApi
 */
export const JokesLayer = () =>
  createLayerModelBlock(
    Contextual.withContext(() => ({
      jokes: () => {
        return async () => {
          const res = await fetch('https://official-joke-api.appspot.com/random_joke');
          if (!res.ok) {
            throw Error('Failed to fetch joke');
          }
          const jokeResponse: Jokes = await res.json();
          return jokeResponse;
        };
      },
      dogImage: () => {
        return () => fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json() as Promise<Dogs>);
      },
    })),
    Visuals.withImage(({ context }) => {
      return context.dogImage.value()?.message;
    }),
    Visuals.withLabel(({ context }) => {
      const [joke, error] = [context.jokes.value(), context.jokes.error()];
      if (error)
        return {
          name: (error as Error).message,
          color: 'red',
        };
      if (!joke)
        return {
          name: 'Loading...',
          color: '#ffffff50',
        };
      return {
        name: `joke ${joke.id.toString()}`,
        color: 'yellow',
      };
    }),
    Table.withRows(({ context }) => {
      const joke = context.jokes.value();
      if (!joke) return undefined;
      return [
        {
          setup: joke.setup,
          punchline: joke.punchline,
        },
      ];
    })
  );
