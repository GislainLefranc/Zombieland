import { NavLink, Link } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { RedLink } from './RedLink';
import { useAuth } from '../Auth/authContext';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NavigationItem {
  name: string;
  to: string;
  current: boolean;
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("vous êtes déconnectés, à bientot !");
  };

  const navigation: NavigationItem[] = useMemo(() => {
    const baseNavigation = [
      { name: 'Accueil', to: '/', current: true },
      { name: 'Nos activités', to: '/activities', current: false },
      { name: 'Informations utiles', to: '/informations-utiles', current: false },
    ];

    if (user?.role_id === 2) {
      baseNavigation.push({ name: 'Mon Profil', to: `/user/${user.id}`, current: false });
    }
    
    if (user?.role_id === 3) {
      baseNavigation.push({ name: 'Administration', to: '/admindashboard', current: false });
    }

    return baseNavigation;
  }, [user]);

  return (
    <Disclosure as="nav" className="bg-grey">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Conteneur principal de la barre de navigation */}
        <div className="flex h-16 justify-between">
          {/* Section de gauche contenant le logo et les éléments */}
          <div className="flex">
            {/* Bouton de menu mobile */}
            <div className="-ml-2 mr-2 flex items-center md:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>

            {/* Logo du site */}
            <Link to="/" className="flex flex-shrink-0 items-center">
              <img alt="Logo" src="src/assets/img/logo.webp" className="h-11 w-auto " />
            </Link>

            {/* Menu navigation */}
            <div className="navigation hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {navigation.map((item: NavigationItem) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current ? 'text-white' : 'text-white',
                    'rounded-md px-3 py-2 text-sm font-medium',
                  )}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Section de droite contenant les boutons Réservation et Connexion/Déconnexion */}
          <div className="hidden md:flex items-center gap-3">
            {/* Bouton Réservation */}
            <RedLink to="/bookings" textSize="text-sm" position="min-w-[120px] w-full flex justify-center">
              Réservation
            </RedLink>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="min-w-[120px] w-full flex justify-center items-center rounded-md bg-red-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-secondary transform transition-transform duration-400 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Déconnexion
              </button>
            ) : (
              <RedLink
                to="/login"
                textSize="text-sm"
                position="min-w-[120px] w-full flex justify-center"
              >
                Connexion
              </RedLink>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <DisclosurePanel className="md:hidden">
        <div className="navigation-mobile space-y-1 px-2 pb-3 pt-2 sm:px-3">
          {navigation.map((item) => (
            <NavLink to={item.to} key={item.name}>
              <DisclosureButton
                as="div"
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'text-white' : 'text-white hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            </NavLink>
          ))}

          {/* Bouton Réservation */}
          
          <NavLink to="/bookings">
            <DisclosureButton
              as="div"
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-white"
            >
              Réservation
            </DisclosureButton>
          </NavLink>

          {/* Bouton Connexion/Déconnexion */}
          {user ? (
            <DisclosureButton
              as="button"
              onClick={logout}
              className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-white hover:text-white"
            >
              Déconnexion
            </DisclosureButton>
          ) : (
            <NavLink to="/login">
              <DisclosureButton
                as="div"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-white"
              >
                Connexion
              </DisclosureButton>
            </NavLink>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navbar;
