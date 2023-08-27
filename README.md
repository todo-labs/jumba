<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/todo-labs/jumba">
    <img src="public/logo.svg" alt="Logo" width="80" height="80">
  </a>

<h1 align="center">Jumba</h1>

  <p align="center">
    <a href="https://jumba.conceptcodes.dev">View Demo</a>
    ·
    <a href="https://github.com/todo-labs/jumba/issues">Report Bug</a>
    ·
    <a href="https://github.com/todo-labs/jumba/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

[![Product Name Screen Shot][product-screenshot]][app-url]

Introducing Jumba 🍳: Your personalized recipe generator, crafting hassle-free cooking experiences akin to HelloFresh. The name Jumba actually comes from the TV show [Lilo & Stich](https://en.wikipedia.org/wiki/Lilo_&_Stitch), where Dr. Jumba was an alien scientist who was convicted for creating illegal genetic experiments 😮. Jumba is a recipe generator that uses the OpenAI & Langchain to generate recipes based on the ingredients you have lying around your fridge/pantry. Powered by the T3 Stack, this modern full-stack marvel combines Next.js and TypeScript for a sleek frontend, while leveraging NextAuth.js, Prisma, and tRPC for seamless authentication, efficient database management, and robust APIs. Elevate your culinary journey today with Jumba, where every dish is an adventure! 🌟🍽️

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![Prisma][Prisma]][Prisma-url]
- [Next Auth](https://next-auth.js.org/)
- [Langchain](https://js.langchain.com/docs/get_started/introduction)
- [shadcn/ui](https://ui.shadcn.com/docs)


### Features
- Email Magic Link Authentication
- AI Experiment Generator
- Experiment Listing & Reviews


### What I Learned ?

- How to use NextAuth.js to implement authentication and authorization
- Langchain API integration
- How to use tRPC to implement a GraphQL-like API
- How to use Tailwind CSS & Radix UI to build a responsive and engaging UI

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Prerequisites

Make sure you have the following tools installed on your system:

- [Node.js](https://nodejs.org/) (Recommended version: +18)
- [Yarn](https://yarnpkg.com/) (Recommended version: 1.22.x)
- [Postgresql](https://www.postgresql.org/) (Recommended version: 15)



### Installation

1. Get an Open AI API Key at [Open AI Platform](https://platform.openai.com/)
2. Clone the repo
   ```bash
    git clone https://github.com/todo-labs/jumba.git
   ```
3. Install NPM packages
   ```bash
    yarn install
   ```
4. Copy over your env file
   ```bash
    cp .env.example  .env
   ```
6. Run the development server
   ```bash
    yarn dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Roadmap

- [ ] Add a filters for home experiment listing
- [ ] Add a photo uploads to review card
- [ ] Add Dashboard Image review tab
- [ ] Add timer component to the steps if applicable

See the [open issues](https://github.com/todo-labs/jumba/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat(scope): Add some AmazingFeature (fixes #123)'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contact

David Ojo - [@conceptcodes](https://github.com/conceptcodes) - conceptcodes@gmail.com

Project Link: [https://github.com/todo-labs/jumba](https://github.com/todo-labs/jumba)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/todo-labs/jumba.svg?style=for-the-badge
[contributors-url]: https://github.com/todo-labs/jumba/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/todo-labs/jumba.svg?style=for-the-badge
[forks-url]: https://github.com/todo-labs/jumba/network/members
[stars-shield]: https://img.shields.io/github/stars/todo-labs/jumba.svg?style=for-the-badge
[stars-url]: https://github.com/todo-labs/jumba/stargazers
[issues-shield]: https://img.shields.io/github/issues/todo-labs/jumba.svg?style=for-the-badge
[issues-url]: https://github.com/todo-labs/jumba/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/david-ojo-66a12a147
[product-screenshot]: public/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[app-url]: https://jumba.conceptcodes.dev
