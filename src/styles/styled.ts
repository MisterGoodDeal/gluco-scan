import type { ExecutionContext } from 'styled-components';

import type { AppTheme } from './theme';

export type StyledThemeProps = ExecutionContext & { theme: AppTheme };
