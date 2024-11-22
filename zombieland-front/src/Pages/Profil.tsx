import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { getDataById, createData, updateData, deleteData } from '../services/api';
import { useParams } from 'react-router-dom';
import { Title } from '../components/Title';
import PasswordModal from '../components/PasswordModal';
import ReviewModal from '../components/ReviewModal';
import { useAuth } from '../Auth/authContext';
import { toast } from 'react-toastify';

interface UserProps {
  id: number;
  firstname: string;
  lastname: string;
  phone_number: string;
  email: string;
  password: string;
  street_address: string;
  postal_code: string;
  city: string;
  birthday: Date | null;
  image: string;
}

interface ReservationProps {
  id: number;
  date_start: Date;
  date_end: Date;
  number_tickets: number;
}

const Profil = () => {
  const { logout } = useAuth(); // Context for authentication
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // État de la modale pour les avis
  const [user, setUser] = useState<UserProps>({
    id: 0,
    firstname: '',
    lastname: '',
    phone_number: '',
    email: '',
    password: '',
    street_address: '',
    postal_code: '',
    city: '',
    birthday: null,
    image: '',
  });

  const [reservations, setReservations] = useState<ReservationProps[]>([]);

  const { userId } = useParams(); // Retrieve user ID from the URL

  useEffect(() => {
    const fetchOneUser = async () => {
      try {
        if (userId) {
          // Fetch user data
          const dataUser = await getDataById('/users', userId);
          setUser({
            ...dataUser,
            birthday: dataUser.birthday ? new Date(dataUser.birthday) : null,
          });
          // Fetch user reservations
          const dataReservations = await getDataById('/bookings/user', userId);
          setReservations(dataReservations);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données d'un utilisateur", error);
      }
    };
    fetchOneUser();
  }, [userId]);

  // Handle image upload and conversion to base64
  const updateImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    // Retrieve the file provided by the user in the input field
    const files = evt.target.files;
    if (!files) return;
    const file = files[0]; // File

    // Convert the file to a data URL
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setUser({
        ...user,
        image: reader.result as string,
      });
    });
    reader.readAsDataURL(file);
  };

  // Handle profile form submission
  const handleSubmit = (evt: React.ChangeEvent<HTMLFormElement>) => {
    // Prevent default form submission
    evt.preventDefault();

    if (user.id) {
      updateData('/users', user.id, user); // Update user data
      toast.success('Votre profil a été mis à jour avec succès.');
    } else {
      createData('/users', user); // Create new user
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    const confirmation = window.confirm(
      'Voulez-vous vraiment supprimer votre profil ? Cette action est irréversible.'
    );
    if (confirmation) {
      try {
        if (userId) {
          await deleteData('/users', userId); // Delete user data
          toast.success('Votre profil a été supprimé avec succès.');

          // Log the user out using the context and redirect to the Login page included in the useContext
          logout();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du profil :', error);
        alert(
          'Une erreur est survenue lors de la tentative de suppression de votre profil. Veuillez réessayer.'
        );
      }
    }
  };

  // Handle input changes
  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle opening of the review modal
  const handleOpenReviewModal = () => {
    if (reservations.length > 0) {
      setIsReviewModalOpen(true);
    } else {
      toast.error('Vous devez avoir une réservation pour laisser un avis.');
    }
  };

  return (
    <div className="bg-black pt-1 pb-1">
      <div className="grid grid-cols-1 md:grid-cols-2 pt-10 gap-x-8 gap-y-8 m-6 bg-black">
        <div className="md:col-start-1 md:col-end-2">
          <section className="">
            <h2 className="text-2xl text-white mb-6">Réservations actuelles :</h2>
            <div>
              <img src="" alt="" />
              <Title>Nom de la réservation</Title>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-high">
                  <tr>
                    <th className="px-6 py-3 text-xs text-white font-medium uppercase tracking-wider text-center">
                      Date de début
                    </th>
                    <th className="px-6 py-3 text-xs text-white font-medium uppercase tracking-wider text-center">
                      Jusqu'au (inclus)
                    </th>
                    <th className="px-6 py-3 text-xs text-white font-medium uppercase tracking-wider text-center">
                      Nombre de tickets
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-green-high divide-y divide-gray-200">
                  {reservations.map((resa) => (
                    <tr key={resa.id}>
                      <td className="text-white px-6 py-4 whitespace-nowrap text-center">
                        {new Date(resa.date_start).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="text-white px-6 py-4 text-center">
                        {new Date(resa.date_end).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="text-white px-6 py-4 whitespace-nowrap text-center">
                        {resa.number_tickets}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bouton pour laisser un avis */}
            <button
              onClick={handleOpenReviewModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
            >
              Laisser un avis
            </button>
          </section>
        </div>
        <form
          className="bg-green-high shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-start-2 md:col-end-3"
          onSubmit={handleSubmit}
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="photo" className="block font-medium text-white text-sm/6">
                  Photo
                </label>
                <div className="flex items-center mt-2 gap-x-3">
                  {user.image === null ? (
                    <UserCircleIcon aria-hidden="true" className="w-12 h-12 text-gray-300" />
                  ) : (
                    <img alt="" src={user.image} className="inline-block h-12 w-12 rounded-md" />
                  )}
                  <label
                    htmlFor="file-upload"
                    className="rounded-md bg-green-high px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Modifier
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onInput={updateImage}
                    />
                  </label>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="lastname" className="block font-medium text-white text-sm/6">
                  Nom
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={user.lastname}
                    onChange={handleInputChange}
                    placeholder={user ? user.lastname : ''}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm bg-green-high ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="firstname" className="block font-medium text-white text-sm/6">
                  Prénom
                </label>
                <div className="mt-2">
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={user.firstname}
                    onChange={handleInputChange}
                    placeholder={user ? user.firstname : ''}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm bg-green-high ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="birthday" className="block font-medium text-white text-sm/6">
                  Date de naissance
                </label>
                <div className="mt-2">
                  <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm bg-green-high ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="street_address" className="block font-medium text-white text-sm/6">
                  Adresse
                </label>
                <div className="mt-2">
                  <input
                    id="street_address"
                    name="street_address"
                    type="text"
                    placeholder={user.street_address ? user.street_address : ''}
                    value={user.street_address ? user.street_address : ''}
                    onChange={handleInputChange}
                    autoComplete="street-address"
                    className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm bg-green-high ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block font-medium text-white text-sm/6">
                  Ville
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder={user.city ? user.city : ''}
                    value={user.city ? user.city : ''}
                    onChange={handleInputChange}
                    autoComplete="address-level2"
                    className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm bg-green-high ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="postal_code" className="block font-medium text-white text-sm/6">
                  Code Postal
                </label>
                <div className="mt-2">
                  <input
                    id="postal_code"
                    name="postal_code"
                    type="text"
                    placeholder={user.postal_code ? user.postal_code : ''}
                    value={user.postal_code ? user.postal_code : ''}
                    onChange={handleInputChange}
                    autoComplete="postal-code"
                    className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm bg-green-high ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="email" className="block font-medium text-white text-sm/6">
                  Contact
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={user ? user.email : ''}
                    value={user ? user.email : ''}
                    onChange={handleInputChange}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm bg-green-high ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="phone_number" className="block font-medium text-white text-sm/6">
                  Téléphone
                </label>
                <div className="mt-2">
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="text"
                    placeholder={user ? user.phone_number : ''}
                    value={user ? user.phone_number : ''}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm bg-green-high ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="button"
                  className="px-3 py-2 sm:col-span-2 text-sm font-semibold text-white rounded-md shadow-sm bg-red-primary hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-secondary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Modifier le mot de passe
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end px-4 py-4 border-t gap-x-6 border-gray-900/10 sm:px-8">
            <button
              onClick={handleDeleteProfile}
              type="button"
              className="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-red-primary hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-secondary"
            >
              Supprimer le Profil
            </button>
            <div className="flex ml-auto gap-x-3">
              <button type="button" className="font-semibold text-white text-sm/6">
                Annuler
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-red-primary hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-secondary"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>

        {/* Modale pour changer le mot de passe */}
        <PasswordModal
          isOpen={isModalOpen}
          user={user}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />

        {/* Modale pour laisser un avis */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={(note, comment) => {
            // Envoyer les données de l'avis au serveur
            const newReview = {
              note,
              comment,
              user_id: user.id,
            };

            createData('/reviews', newReview)
              .then(() => {
                toast.success('Votre avis a été soumis !');
              })
              .catch((error) => {
                console.error("Erreur lors de la soumission de l'avis :", error);
                toast.error('Impossible de soumettre votre avis.');
              });
          }}
        />
      </div>
    </div>
  );
};

export default Profil;
