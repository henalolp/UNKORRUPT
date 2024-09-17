# AI-driven learning and corruption fighting

PatriotAi is a decentralized platform leveraging on UN and policy resources on corruption, ICP blockchain, and AI to educate on corruption and collect data on corruption.

## Why PatriotAi?

PatriotAi is a free learning platform where you get to learn about corruption. We offer a variety of courses where you can interact with AI and ask any questions. You also get to report cases and earn rewards from quizzes.

1. Understand corruption: We offer different courses to help you understand corruption.
2. Fight corruption: Once you get it, you can make reports on the platform. People learn from responding to your data
3. Earn rewards: You earn 10 UNK tokens for every completed quiz!

## Infrastructure

PatriotAi is built on the IC using Motoko as the backend programming language and ReactJs for the frontend. It uses a custom-trained OpenAI model for course and quiz generation. It has an ACL for managing courses. Generated courses are reviewed by the team and approved before users can take them.

A custom token, UNK,  built and deployed on the IC is minted to users once they complete a course.

It has a chatbot for each course, that helps the user have an interactive learning.

PatriotAi used the following from IC:
1. HTTPS outcalls
2. Timers
3. ICRC1
4. Internet Identity


## Live link (mainnet)
 Check out our website below:
  [ParrotAI](https://kzwfs-haaaa-aaaak-ak3uq-cai.icp0.io)


## PitchDeck 
 Learn more on our vision and mission:
  [PitchDeck](https://shorturl.at/Gx6k7)

## Get Started

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with UN, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd UNKORRUPT/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor



