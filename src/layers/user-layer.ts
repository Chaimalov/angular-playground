import { LayerModelBuilder } from './layer-builder';
import { UserResponse } from './user.types';

export const UserLayer = LayerModelBuilder.create('layer1')
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
  .withLabel(({ users }) => {
    const user = users.value()?.[0];
    if (!user) return undefined;

    return {
      name: `${user.name.title} ${user.name.first} ${user.name.last}`,
      color: user.gender === 'male' ? 'lightblue' : 'pink',
    };
  })
  .withRows(({ users }) => {
    return users.value()?.map(user => {
      const { email, nat, phone, cell } = user;
      return {
        email,
        nat,
        phone,
        cell,
      };
    });
  })
  .withImage(({ users }) => {
    const user = users.value()?.[0];
    return user?.picture.large;
  })
  .build();
