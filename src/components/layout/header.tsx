import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Monitor, LogOut, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { logout } from '@/features/auth/authSlice';
import type { RootState } from '@/lib/store';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Header() {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);

  const themes = ['neon','light-bliss', 'retro-warm', 'gradient-luxe'];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center sm:px-2">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg transition-colors hover:bg-primary/90"
        >
          <Monitor className="h-5 w-5" />
          <span className="font-bold text-sm sm:text-base">Gati Desk</span>
        </Link>

        {/* Navigation and Actions */}
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          {/* User Greeting */}
          {user && (
            <span className="hidden sm:inline text-xs sm:text-sm text-muted-foreground">
              Welcome, {user.username}
            </span>
          )}

          {/* Theme Dropdown */}
          <nav className="relative flex items-center space-x-1 sm:space-x-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full p-2"
                  aria-label="Toggle theme menu"
                >
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[8rem] rounded-md p-1 shadow-md border 
                             bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  align="end"
                  sideOffset={5}
                >
                  {themes.map((availableTheme) => (
                    <DropdownMenu.Item
                      key={availableTheme}
                      onSelect={() => setTheme(availableTheme as typeof theme)}
                      className={`cursor-pointer rounded-md px-3 py-2 text-sm 
                                  transition-colors focus:outline-none 
                                  ${
                                    theme === availableTheme
                                      ? 'bg-primary text-primary-foreground'
                                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                    >
                      {availableTheme.charAt(0).toUpperCase() +
                        availableTheme.slice(1)}{' '}
                      {/* Capitalize */}
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Arrow className="fill-white dark:fill-gray-800" />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Logout Button */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(logout())}
                className="rounded-full p-2"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}


export default Header;