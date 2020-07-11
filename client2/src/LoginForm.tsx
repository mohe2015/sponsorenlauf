import React, { ChangeEvent } from "react";

export interface Props {}

export interface State {
  username: string;
  password: string;
}

export class LoginForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { username: "", password: "" };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    alert(this.state.username);
    event.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
