import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {App} from "./app";

const container = document.createElement('div');
document.body.append(container);
createRoot(container).render(<App/>)