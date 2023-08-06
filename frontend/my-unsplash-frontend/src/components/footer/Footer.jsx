import githubIcon from "./../../assets/github.svg";
import linkedinIcon from "./../../assets/linkedin.svg";
import SOIcon from "./../../assets/stack-overflow.svg";
import twitterIcon from "./../../assets/x-twitter.svg";

export default function Footer() {
  const footerStyle = {
    padding: "2em",
    background: "#3db46d",
    textAlign: "center",
    marginTop: "10rem",
  };
  const iconSize = {
    width: "2rem",
  };
  const flex = {
    marginBlock: "1rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <footer style={footerStyle}>
      <p>
        created by
        <a href="https://devchallenges.io/portfolio/jukha"> jukha - </a>
        devChallenges.io
      </p>
      <ul style={flex}>
        <li>
          <a href="https://github.com/jukha/" target="_blank" rel="noreferrer">
            <img
              style={iconSize}
              src={githubIcon}
              alt="link to github profile"
            />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/muhammad-junaid-khan-92a493238/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              style={iconSize}
              src={linkedinIcon}
              alt="link to linkedin profile"
            />
          </a>
        </li>
        <li>
          <a
            href="https://stackoverflow.com/users/9009481/junaid"
            target="_blank"
            rel="noreferrer"
          >
            <img
              style={iconSize}
              src={SOIcon}
              alt="link to stack oveflow profile"
            />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/Muhamma74476781"
            target="_blank"
            rel="noreferrer"
          >
            <img
              style={iconSize}
              src={twitterIcon}
              alt="link to twitter profile"
            />
          </a>
        </li>
      </ul>
      <p>
        Copyright © {new Date().getFullYear()} M.Junaid All Rights Reserved.
      </p>
    </footer>
  );
}
