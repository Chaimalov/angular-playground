import { from, map } from 'rxjs';
import { Contextual, Table, Visuals } from '../store-features';
import { createLayerModelBlock } from './create-layer-model';
import { UserResponse } from './user.types';

export const UserLayer = createLayerModelBlock(
  Contextual.withContext(() => ({
    users: from(
      (async () => {
        const res = await fetch('https://randomuser.me/api/');

        if (!res.ok) {
          throw Error('Failed to fetch user');
        }

        const userResponse: UserResponse = await res.json();

        return userResponse.results ?? [];
      })()
    ),
  })),
  Visuals.withLabel(({ context }) => {
    return context.users.pipe(
      map(users => users[0]),
      map(user => ({
        name: `${user.name.title} ${user.name.first} ${user.name.last}`,
        color: user.gender === 'male' ? 'lightblue' : 'pink',
      }))
    );
  }),
  Table.withRows(({ context }) => {
    return context.users.pipe(
      map(users =>
        users.map(({ email, nat, phone, cell }) => ({
          email,
          nat,
          phone,
          cell,
        }))
      )
    );
  }),
  Visuals.withImage(({ context }) => context.users.pipe(map(users => users[0].picture.medium)))
);
