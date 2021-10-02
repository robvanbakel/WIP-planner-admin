# [WIP] Planner Admin

The [WIP] Planner Admin is responsible for the higher-level functions of the [[WIP] Planner](https://github.com/robvanbakel/wip-planner), that cannot be executed by the app on the frontend. At this moment, the Admin serves these purposes:

## Routes

| Route            | Method | Parameter     | Description                                                  |
| :--------------- | :----- | :------------ | :----------------------------------------------------------- |
| `/createNewUser` | POST   | email address | Creates a new user in Firebase and returns the uid           |
| `/feed`          | GET    | uid           | Finds all shifts for the provided user and returns iCal feed |
| `/getSchedules`  | GET    | uid           | Gets all schedules for a single employee                     |
| `/getUser`       | GET    | uid           | Gets user data for a single employee                         |

## Functions

| Function          | Description                                                         |
| :---------------- | :------------------------------------------------------------------ |
| `shiftDatabase()` | Shift all demo content by a week every Monday at midnight           |
| `getSettings()`   | Serve settings form database, store settings in memory for one hour |

#### Built With

- [Express](http://expressjs.com)
- [Firebase Admin SDK](https://firebase.google.com/docs/reference/admin)

## Other repositories

- [robvanbakel/wip-planner](https://github.com/robvanbakel/wip-planner)
