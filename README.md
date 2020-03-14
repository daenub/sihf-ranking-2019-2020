# 🏒 SIHF NL Regular season 19/20 ranking history visualisation

A visualisation prototype of the history of the SIHF NL regular reason 19/20.

## Data
I got the whole schedule from the [SIHF Game Center](https://www.sihf.ch/de/game-center/national-league/#/results/date/asc/page/0/2020/1/3092/13.09.2019-29.02.2020). Sadly they didn't deliver the number of the round so i had to scrape that from [hockeyfans.ch](http://www.hockeyfans.ch/) and merge those informations into the schedule.

My calculation of the ranking is most likely not correct! I couldn't find the exact rules yet ;)

## Installation

```
git clone git@github.com:daenub/sihf-ranking-2019-2020
yarn
```

## Usage

### Development server

```bash
yarn start
```

### Production build

```bash
yarn build
```

### Deploy to GitHub Pages

This command will commit and push the content of the dist folder to the gh-pages branch.

```bash
yarn deploy
```
