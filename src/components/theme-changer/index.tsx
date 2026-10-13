import { RiDice4Line } from 'react-icons/ri';
import { SanitizedThemeConfig } from '../../interfaces/sanitized-config';
import { LOCAL_STORAGE_KEY_NAME } from '../../constants';
import { skeleton } from '../../utils';
import { MouseEvent, useEffect, useRef, useState } from 'react';

/**
 * Renders a theme changer component.
 *
 * @param {Object} props - The props object.
 * @param {string} props.theme - The current theme.
 * @param {function} props.setTheme - A function to set the theme.
 * @param {boolean} props.loading - Whether the component is in a loading state.
 * @param {SanitizedThemeConfig} props.themeConfig - The theme configuration object.
 * @return {JSX.Element} The rendered theme changer component.
 */
const ThemeChanger = ({
  theme,
  setTheme,
  loading,
  themeConfig,
}: {
  theme: string;
  setTheme: (theme: string) => void;
  loading: boolean;
  themeConfig: SanitizedThemeConfig;
}) => {
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const options = [
    themeConfig.defaultTheme,
    ...themeConfig.themes.filter((item) => item !== themeConfig.defaultTheme),
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      changeTheme(options[focusedIndex]);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close when tapping/clicking anywhere outside the menu.
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, isOpen]);

  const changeTheme = (
    selectedTheme: string,
    e?: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    e && e.preventDefault();

    document.querySelector('html')?.setAttribute('data-theme', selectedTheme);

    typeof window !== 'undefined' &&
      localStorage.setItem(LOCAL_STORAGE_KEY_NAME, selectedTheme);

    setTheme(selectedTheme);
  };

  const themeButton = ({
    name,
    ringColor,
    primary,
    secondary,
  }: {
    name: string;
    ringColor: string;
    primary: string;
    secondary: string;
  }) => {
    return (
      <div
        className="rounded-full w-8 h-8 ring-3 ring-offset-base-100 ring-offset-2"
        style={{ color: ringColor }}
      >
        <button
          className="w-8 h-8 rounded-full cursor-pointer"
          style={{ background: primary }}
          onClick={(e) => changeTheme(name, e)}
          title={`Change Theme to ${name.charAt(0).toUpperCase() + name.slice(1)}`}
          aria-label={`Change Theme to ${name.charAt(0).toUpperCase() + name.slice(1)}`}
        >
          <div
            style={{ background: secondary }}
            className="h-4 w-8 rounded-tl-full rounded-tr-full relative bottom-2"
          />
        </button>
      </div>
    );
  };

  return (
    <div className="card overflow-visible shadow-lg card-sm bg-base-100">
      <div className="flex-row items-center space-x-4 flex pl-6 pr-4 py-4">
        <div className="">
          <h2 className="card-title">
            {loading ? (
              skeleton({
                widthCls: 'w-20',
                heightCls: 'h-8',
                className: 'mb-1',
              })
            ) : (
              <span className="text-base-content">Theme</span>
            )}
          </h2>
          <span className="text-base-content/80 capitalize text-sm">
            {loading
              ? skeleton({ widthCls: 'w-16', heightCls: 'h-5' })
              : theme === themeConfig.defaultTheme
                ? 'Default'
                : theme}
          </span>
        </div>
        <div className="w-full flex flex-nowrap items-center justify-around gap-2">
          {themeButton({
            name: 'emerald',
            ringColor: '#ffffff',
            primary: '#66cc8a',
            secondary: '#d1d1d1',
          })}
          {themeButton({
            name: 'synthwave',
            ringColor: '#0a002f',
            primary: '#f961b4',
            secondary: '#1d184b',
          })}
          {themeButton({
            name: 'retro',
            ringColor: '#ece3cb',
            primary: '#fea0a0',
            secondary: '#dbca9b',
          })}
          {themeButton({
            name: 'sunset',
            ringColor: '#121c23',
            primary: '#ff865b',
            secondary: '#091319',
          })}

          {loading ? (
            skeleton({
              widthCls: 'w-12',
              heightCls: 'h-10',
              className: 'mr-6',
            })
          ) : (
            <div
              ref={dropdownRef}
              title="Change Theme"
              // `dropdown-open` makes daisyUI show the menu from React state.
              // Without it the menu only shows while the button has focus,
              // and iOS Safari doesn't focus buttons on tap.
              className={`dropdown dropdown-end ${isOpen ? 'dropdown-open' : ''}`}
              onKeyDown={handleKeyDown}
            >
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="btn btn-ghost m-0 p-0 w-12 h-12 normal-case text-base-content/80 flex items-center whitespace-nowrap"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="More themes"
              >
                <RiDice4Line className="inline-block w-10 h-10 stroke-current" />
              </button>
              {isOpen && (
                <div
                  className="overflow-y-auto shadow-2xl dropdown-content max-h-96 min-w-max rounded-lg bg-base-200 text-base-content z-10"
                  role="listbox"
                >
                  <ul className="p-4 menu menu-sm">
                    {options.map((item, index) => (
                      <li key={item}>
                        <a
                          ref={(el) => {
                            itemRefs.current[index] = el;
                          }}
                          onClick={(e) => {
                            changeTheme(item, e);
                            setIsOpen(false);
                            setFocusedIndex(index);
                          }}
                          className={`focus:bg-base-300 ${theme === item ? 'active' : ''} ${
                            focusedIndex === index ? 'bg-base-300' : ''
                          }`}
                          role="option"
                          aria-selected={theme === item}
                          tabIndex={-1}
                        >
                          <span className="capitalize">
                            {item === themeConfig.defaultTheme
                              ? 'Default'
                              : item}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            // <div title="Change Theme" className="dropdown dropdown-end">
            //   <div
            //     tabIndex={0}
            //     className="btn btn-ghost m-1 normal-case text-base-content/80 flex items-center whitespace-nowrap"
            //   >
            //     <RiDice4Line className="inline-block w-5 h-5 stroke-current" />
            //   </div>
            //   <div
            //     tabIndex={0}
            //     className="mt-16 overflow-y-auto shadow-2xl top-px dropdown-content max-h-96 min-w-max rounded-lg bg-base-200 text-base-content z-10"
            //   >
            //     <ul className="p-4 menu menu-sm">
            //       {[
            //         themeConfig.defaultTheme,
            //         ...themeConfig.themes.filter(
            //           (item) => item !== themeConfig.defaultTheme,
            //         ),
            //       ].map((item, index) => (
            //         <li key={index}>
            //           {}
            //           <a
            //             onClick={(e) => changeTheme(e, item)}
            //             className={`${theme === item ? 'active' : ''}`}
            //           >
            //             <span className="capitalize">
            //               {item === themeConfig.defaultTheme ? 'Default' : item}
            //             </span>
            //           </a>
            //         </li>
            //       ))}
            //     </ul>
            //   </div>
            // </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeChanger;
