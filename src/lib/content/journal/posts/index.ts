import type { Post } from '../types';
import { bostonShaker } from './boston-shaker';
import { brewMethods } from './brew-methods';
import { christmasDelivery } from './christmas-delivery';
import { coffeeGifts } from './coffee-gifts';
import { consoleStyling } from './console-styling';
import { handGrinder } from './hand-grinder';
import { homeBar } from './home-bar';
import { housewarming } from './housewarming';
import { kissaten } from './kissaten';
import { pourOverBeginners } from './pour-over-beginners';

/** The first post is featured on the Journal page when dates are equal. */
export const POSTS: Post[] = [coffeeGifts, christmasDelivery, housewarming, pourOverBeginners, kissaten, homeBar, consoleStyling, brewMethods, handGrinder, bostonShaker];
