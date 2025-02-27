import { LayerModelBuilder } from './layer-builder';
import { UserResponse } from './user.types';

export const UserLayer = LayerModelBuilder.create()
  .withContext({
    users: () => {
      return async () => {
        const res = await fetch('https://randomuser.me/api/');

        if (!res.ok) {
          throw Error('Failed to fetch user');
        }

        const userResponse: UserResponse = await res.json();

        return userResponse.results ?? [];
      };
    },
  })
  .withLabel(({ context }) => {
    const user = context.users.value()?.[0];
    if (!user) return undefined;

    return {
      name: `${user.name.title} ${user.name.first} ${user.name.last}`,
      color: user.gender === 'male' ? 'lightblue' : 'pink',
    };
  })
  .withRows(({ context }) => {
    return context.users.value()?.map(user => {
      const { email, nat, phone, cell } = user;
      return {
        email,
        nat,
        phone,
        cell,
      };
    });
  })
  .withImage(({ context }) => {
    const user = context.users.value()?.[0];
    return user?.picture.medium;
  })
  .build();
