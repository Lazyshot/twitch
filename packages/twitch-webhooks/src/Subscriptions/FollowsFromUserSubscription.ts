import { HelixFollow, HelixResponse } from 'twitch';
import { HelixFollowData } from 'twitch/lib/API/Helix/User/HelixFollow';
import WebHookListener from '../WebHookListener';
import Subscription from './Subscription';

/**
 * @inheritDoc
 * @hideProtected
 */
export default class FollowsFromUserSubscription extends Subscription<HelixFollow> {
	/** @private */
	constructor(
		private readonly _userId: string,
		handler: (data: HelixFollow) => void,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id() {
		return `follows.from.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixFollowData>) {
		return new HelixFollow(response.data[0], this._client._twitchClient);
	}

	protected async _subscribe() {
		return this._client._twitchClient.helix.webHooks.subscribeToUserFollowsFrom(this._userId, this._options);
	}

	protected async _unsubscribe() {
		return this._client._twitchClient.helix.webHooks.unsubscribeFromUserFollowsFrom(this._userId, this._options);
	}
}
