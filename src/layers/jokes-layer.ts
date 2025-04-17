import { from, map } from 'rxjs';
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
export const JokesLayer = createLayerModelBlock(
  Contextual.withContext(() => ({
    jokes: from(
      (async () => {
        const res = await fetch('https://official-joke-api.appspot.com/random_joke');
        if (!res.ok) {
          throw Error('Failed to fetch joke');
        }
        const jokeResponse: Jokes = await res.json();
        return jokeResponse;
      })()
    ),
  })),
  Contextual.withContext(() => ({
    dogImage: from(fetch('https://dog.ceo/api/breeds/image/random').then<Dogs>(res => res.json())),
  })),
  Visuals.withImage(({ context }) => context.dogImage.pipe(map(({ message }) => message))),
  Visuals.withLabel(({ context }) =>
    context.jokes.pipe(
      map(joke => ({
        name: `joke ${joke.id.toString()}`,
        color: 'yellow',
      }))
    )
  ),
  Table.withRows(({ context }) =>
    context.jokes.pipe(
      map(joke => [
        {
          setup: joke.setup,
          punchline: joke.punchline,
        },
      ])
    )
  )
);
