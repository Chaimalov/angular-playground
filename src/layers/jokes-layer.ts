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

export const JokesLayer = LayerModelBuilder.create('jokes-layer')
  .withContext({
    jokes: () => {
      return async () => {
        const res = await fetch(
          'https://official-joke-api.appspot.com/random_joke'
        );
        if (!res.ok) {
          throw Error('Failed to fetch joke');
        }
        const jokeResponse: Jokes = await res.json();
        return jokeResponse;
      };
    },
    dogImage: () => {
      return async () => {
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        if (!res.ok) {
          throw Error('Failed to fetch dog image');
        }
        const dogResponse: Dogs = await res.json();
        return dogResponse;
      };
    },
  })
  .withImage(({ dogImage }) => {
    return dogImage.value()?.message;
  })
  .withLabel(({ jokes }) => {
    const joke = jokes.value();
    if (!joke) return undefined;
    return {
      name: `joke ${joke.id.toString()}`,
      color: 'yellow',
    };
  })
  .withRows(({ jokes }) => {
    const joke = jokes.value();
    if (!joke) return undefined;
    return [
      {
        setup: joke.setup,
        punchline: joke.punchline,
      },
    ];
  })
  .build();
