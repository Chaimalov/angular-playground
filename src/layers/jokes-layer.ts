import { LayerModelBuilder } from './layer-builder';

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

export const JokesLayer = LayerModelBuilder.create()
  .withContext({
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
  })
  .withImage(({ context }) => {
    return context.dogImage.value()?.message;
  })
  .withLabel(({ context }) => {
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
  })
  .withRows(({ context }) => {
    const joke = context.jokes.value();
    if (!joke) return undefined;
    return [
      {
        setup: joke.setup,
        punchline: joke.punchline,
      },
    ];
  })
  .build();
