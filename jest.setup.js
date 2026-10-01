import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// required by react-router, not provided by jsdom
Object.assign(global, { TextDecoder, TextEncoder });
