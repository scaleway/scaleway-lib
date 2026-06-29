# Scaleway - Auth Scw

This package contains a React Context Provider which will help to handle authentication workflow within an app.

## Install

```bash
pnpm add @scaleway/auth-scw
```

## Usage

...

## How to dev

### Prerequisites

```
cd packages/auth-scw
```

### Start

```bash
pnpm build # Build the package
pnpm watch # Build the package and watch for changes
```

# Repo pattern

## How does renew token works? Single or multiple organisation

**Reminder:** A COOKIE is used to syncronise jwt between tabs

When users open severals tabs, syncronoisation of token between tabs can become tedious, here are the scenarios:

### Single organisation

Let say you have 2 tabs on the same organisation, `tab1`, `tab2` with the same JWT, let's call it, `JWT_A`

1. you navigate on `tab2` and after 1h renew your `JWT_A` (and update the cookie) with a new jwt called `JWT_B`
2. now `tab1` has a React state with an expired `JWT_A` and tabs 2 has renewed its jwt with `JWT_B`
3. you leave for 1h. You come back on the console app after the `JWT_B` on `tab2` has expired
4. `tab1` AND `tab2` have both a different expired jwt, `JWT_A` and `JWT_B`
5. you go on `tab1` do an action on the console => a request is sent
6. The code will check, React state `JWT_A` is expired then check Cookie `JWT_B` is also expired

// A long term bug use to be:

1. A renew request on `tab1` is attempted with `JWT_A` renew token (which has already been used on step 1)
2. the API trigger an error telling you (more or less) that this `JWT_A` for renew has already been used (which is fair)

// Bug corrected

1. A renew request on `tab1` is attempted with the last JWT from cookie (so JWT_B) and also because both tabs are on the same organisation therefore, the same jwt can be used for both.
2. the renew happen without issue and both tabs can be used without problems

### Multiple organisation

Alright, read the Single organisation scenario if you haven't.
Here let's consider we have `tab1` and `tab2` on `Orga_A` with `JWT_A` and `tab3` on `Orga_B` with `JWT_B`:

1. the last tab you opened is `tab3`, therefore, your cookie is set with `JWT_B` on `Orga_B`
2. you navigate on `tab1` after 1h your `JWT_A` is being renewed in `JWT_A2` AND the app will use the React state instead of the cookie to have the renew token from `JWT_A`. Because the cookie hold `JWT_B` which is set on `Orga_B` and you are navigating on `tab1` which is on `Orga_A`
3. Your renew happens without issue, you keep navigating on `tab1`
4. if you switch tab and go to `tab2` then the app will attempt a `JWT_A` renew (remember `tab1` and `tab2` used both `JWT_A` that they had in their React state)
   but this time because `JWT_A` has already been used on step 2 to renew, the request will **fail** and tell you `JWT_A` has already been used for renew => this will end up in disconnecting the user
   At the moment we only use the cookie to syncronise tabs on only **ONE** organisation, but other tab which have switched organisation will not work because they are not using the same organisation than the cookie.
