import photo from './documents/photo.js';
import performance from './documents/performance.js';
import cvLine from './documents/cvLine.js';
import video from './documents/video.js';
import press from './documents/press.js';
import atelier from './documents/atelier.js';
import settings from './singletons/settings.js';
import home from './singletons/home.js';
import bio from './singletons/bio.js';
import contact from './singletons/contact.js';

// Six types qu'elle crée et empile, quatre pages qu'elle modifie.
export const DOCUMENTS = [performance, cvLine, photo, video, press, atelier];
export const SINGLETONS = [home, bio, contact, settings];
export const schemaTypes = [...DOCUMENTS, ...SINGLETONS];
