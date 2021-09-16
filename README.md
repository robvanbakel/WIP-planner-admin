# [WIP] Planner Admin

The [WIP] Planner Admin is responsible for the higher-level functions of the [[WIP] Planner](https://github.com/robvanbakel/wip-planner), that cannot be executed by the app on the frontend. At this moment, the Admin serves two purposes:

| Route            | Method | Parameter     | Description                                                  |
| :--------------- | :----- | :------------ | :----------------------------------------------------------- |
| `/createNewUser` | POST   | email address | Creates a new user in Firebase and returns the uid           |
| `/feed`          | GET    | uid           | Finds all shifts for the provided user and returns iCal feed |

#### Built With

- [Express](http://expressjs.com)
- [Firebase Admin SDK](https://firebase.google.com/docs/reference/admin)

## Other repositories

- [robvanbakel/wip-planner](https://github.com/robvanbakel/wip-planner)
