import {InjectionToken} from '@angular/core';
import {EgwSourceType} from '../repositories/post.repository';

export const EGW_SOURCE_TOKEN = new InjectionToken<EgwSourceType>('EGW_SOURCE_TOKEN');
