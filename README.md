# [WIP] Planner Admin

The [WIP] Planner Admin is responsible for the higher-level functions of the [[WIP] Planner](https://github.com/robvanbakel/wip-planner), that cannot be executed by the app on the frontend. At this moment, the Admin serves three purposes:

## Routes

| Route            | Method | Parameter     | Description                                                  |
| :--------------- | :----- | :------------ | :----------------------------------------------------------- |
| `/createNewUser` | POST   | email address | Creates a new user in Firebase and returns the uid           |
| `/feed`          | GET    | uid           | Finds all shifts for the provided user and returns iCal feed |

## Functions

| Function          | Description                                               |
| :---------------- | :-------------------------------------------------------- |
| `shiftDatabase()` | Shift all demo content by a week every Monday at midnight |

#### Built With

- [Express](http://expressjs.com)
- [Firebase Admin SDK](https://firebase.google.com/docs/reference/admin)

## Other repositories

- [robvanbakel/wip-planner](https://github.com/robvanbakel/wip-planner)
