import { h, Component } from 'preact';

export class App extends Component<any, any> {
  componentDidMount() {
    console.log('App mounted');
  }

  render() {
    return <h1>Hello World!</h1>;
  }
}
