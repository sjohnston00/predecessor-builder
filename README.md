# todos

- [x] make schemas for hero, abilities and builds
- [ ] fix `<NumberCheckbox/>` when going from toggled: true to toggled: false not unlocking all the other checkboxes again
- [ ] fix `<NumberCheckbox/>` when setting toggled: false, when the ability has already been maxed out, this show an error message and doesn't untoggled the skill point, so you're stuck at this point
- [x] Move new build page to `/builds/new` route
- [ ] Add `backspace` functionality on the skill order section
- [x] Make users sign up using username, password only
- [x] Remove age, firstname and lastname fields from DB
- [ ] Add authentication and authorization function that allow protected routes
- [x] Builds can be made by non-logged in users (remove the required userId on build schema)
- [ ] Builds with no userId will be "Anonymous"
- [ ] Builds can have likes, comments and a description
- [ ] Comments on a build can only be made by authenticated users
- [x] If user is already logged in on and goes to the login page, redirect them to `/` or whatever `?redirectTo` params maps to
- [x] Add logout function to destroy the user session and redirect to `/login` or `?redirectTo` params
- [ ] Be able to load a build from DB and load the skill tree
- [ ] Load the users builds when on `/users/$username` route
- [x] Fix `/builds/new` create build in prisma function
- [x] Fix `/builds/new` skill order react-use-keypress being triggered when typing build name
- [ ] Fix `/builds/new` skill order react-use-keypress being triggered when using general keyboard shortcuts such as Ctrl + T will prevent new tab opening and also triger react-use-keypress (if we can't fix this, we may want to resort to just using a more simple keyboard navigation with ArrowKeys on the grid)
- [x] Create `<Select/>` component that has similar styles to `<Input/>`
- [ ] Builds shouldn't be bound to just 1 hero, we can have a suggested heroes?, and a role?
- [ ] Switch url scheme to have /builds/$buildName no /$hero needed
- [ ] In the /builds route add a search form that allows the user to search for builds by Hero, Role and Name
- [ ] Make buildNames unique in db
- [ ] Save buildNames as normal strings
- [ ] Make every build link url use '-' (dashes) instead of ' ' (spaces) e.g `href={/builds/${build.name.replaceAll(' ', '-)}}` (make sure to reverse this process when getting the build by build name e.g: `params.buildName.replaceAll('-', ' ')`
- [x] Show all items page (include search)
- [x] Allow builds to include items
- [x] Items page, show build that include these items
- [ ] Move items to db from json file
- [ ] Make build items be a relationship to the Items table
- [ ] Make build abilites be a relationship to the Abilities table
- [ ] Add tests

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
