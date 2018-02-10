import { Component, h } from 'preact';
import Channel from '../../entities/Channel';

interface ChannelProps {
  channel: Channel;
  size: string;
}

interface ChannelState {}

export class ChannelComponent extends Component<ChannelProps, ChannelState> {
  constructor(props: ChannelProps) {
    super(props);
  }

  render(props: ChannelProps, state: ChannelState) {
    return (
      <a href={props.channel.url()} target="_blank">
        {props.channel.stream === null ? (
          <div>
            <h2>{props.channel.nickname}</h2>
            <span>Actuellement hors-ligne</span>
          </div>
        ) : (
          <div>
            {props.size === 'big' && <Thumbnail url={props.channel.stream.thumbnail_url} />}
            <div>
              <h2>
                <a href={props.channel.url()} target="_blank">
                  {props.channel.nickname}
                </a>
              </h2>
              <p>{props.channel.stream.title}</p>
              <span>
                Joue à
                <a href={`https://www.twitch.tv/directory/game/${props.channel.stream.game}`} target="_blank">
                  {props.channel.stream.game}
                </a>
                devant <em>{props.channel.stream.viewers}</em> viewers
              </span>
            </div>
          </div>
        )}
      </a>
    );
  }
}
