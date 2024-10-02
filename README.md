# Continuing Education - Next.js, React, Tailwind CSS, Hono, Clerk

I wanted to learn about Next.js/React. This whole project was 2 weeks of slowly going through a tutorial and not created by me. Thank you to Antonio for your tutorial: https://www.youtube.com/watch?v=N_uNKAus0II

## About

In the past few years of switching my IT focus to DevOps/AWS cloud, I have primarily worked with infra and backend microservices using python, typescript, lambdas/ecs/eks, bash, cdk and some terraform. I have always wanted to add a UI to the microservices for managing jobs and insights. (cloudwatch is also an option for metrics).

## Takeaways - App/CSS/Auth

I really enjoyed Next.js and React coming from working with a LAMP stack 20 some years ago. It brought back memories of using Knockout.js too. I liked learning about the structure of the project while I was going through the tutorial. The idea of React components was completely new to me and pretty neat.

I'm not much of a CSS expert/designer and so I appreciated https://tailwindcss.com/ - https://www.radix-ui.com/ - https://ui.shadcn.com/ Having dabbled in SCSS, it was cool to learn about class-variance-authority https://cva.style/docs and `clsx`

Authentication and User Management made easy with https://clerk.com/ This is such a relief to outsource auth implementation from a security point of view.

I do like the idea of path-based routing in Next.js mainly to get a quick overview of the endpoints by browsing a repo. APIs are handled with Hono was also a pleasant experience. Someday I would like to create an API and it's nice to have this as a solid option (especially pairing with Clerk). https://hono.dev/

Learned about zod validation and appreciate its versatility and how easy it was to integrate into db/api. https://zod.dev/

## Takeaways DB

I absolutely loved finally using an ORM along with the tutorial's approach of using seeding scripts in package.json/npm/pnpm. https://orm.drizzle.team/

I am now going to highly consider defaulting to PostgreSQL in cases where I would have used MySQL. This project used https://neon.tech/ AWS' costs are about 30% cheaper for PostgreSQL compared to MySQL: https://instances.vantage.sh/rds/

I'm familiar with the concept of Middleware and it was nice to actually implement this within Next.js. My previous microservices didn't require this.

## Takeaways Other

I discovered pnpm and think it's a great default compared to npm because of its local caching/symlinks. This tutorial actually used bun and so it's on my TODO list. https://pnpm.io/ - https://bun.sh/

I'm embarrassed to say the concept of features, hooks and providers are all new to me. I am happy to have a new way to think about organization.

`dotenv` - I use this approach for other projects.

`date-fns` - I've used alternatives but this was nice to discover.

`cuid2` - horizontally scalable and I've used `uuid7` for some other projects.

## Finally

I had to squash all my commits because I originally started playing with Next.js, starting over several a couple times and then switched over to a tutorial. So it would have been nice to show that but generally after each section or WIP I made a commit.

This repo is for me to reference in the future or for others to see what I've dabbled with.

```sh
# .env.local
# General
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk User Auth/Pool
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Drizzle DB
DRIZZLE_DATABASE_URL=postgresql://user:pass@host.aws.neon.tech/finance?sslmode=require
```

```sh
# run app
pnpm i
pnpm run dev

# run db ui
pnpm run db:studio

# orm - generate sql changes and apply
pnpm run db:generate
pnpm run db:migrate

# seed db
pnpm run db:seed
```
