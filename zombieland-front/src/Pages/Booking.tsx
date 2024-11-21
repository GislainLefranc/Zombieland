// Import des éléments nécessaires
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import BookingForm from "../components/BookingForm";
import { getDatas, createData } from "../services/api"; 
import { Title } from "../components/Title";
import { useAuth } from "../Auth/authContext"; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Interface pour définir la période
interface Period {
  id: number;
  name: string;
  date_start: string;
  date_end: string;
  price: number;
}

// Déclare un composant fonctionnel React nommé UserReservation.
const UserReservation: React.FC = () => {
  const { user } = useAuth(); // Appel direct au hook personnalisé
  const navigate = useNavigate();

  // Crée un état periods pour stocker un tableau de périodes.
  const [periods, setPeriods] = useState<Period[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [numberOfTickets, setNumberOfTickets] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch à l'API pour récupérer toutes les périodes de la base de données
    const fetchPeriods = async () => {
      setIsLoading(true);
      try {
        const periodsData = await getDatas("/periods");
        setPeriods(periodsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des périodes", error);
        toast.error("Erreur lors de la récupération des périodes. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeriods();
  }, []);

  // Gérer la sélection des dates dans le composant UserReservation.
  //const handleDateSelect = (start: Date | null, end: Date | null) => {
    //setStartDate(start);
    //setEndDate(end || start);
  //};
  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };
      //if (!endDate) {
       // setEndDate(startDate);
      //}

  // Calculer le montant total d'une réservation
  useEffect(() => {
    if (startDate && endDate) {
      const period = periods.find(
        (period) =>
          startDate >= new Date(period.date_start) &&
          endDate <= new Date(period.date_end)
      );

      if (period) {
        const numberOfDays =
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
          ) + 1;
        const total = numberOfDays * period.price * numberOfTickets;
        setTotalAmount(total);
      } else {
        setTotalAmount(0); 
      }
    } else if (startDate) {
      const period = periods.find(
        (period) =>
          startDate >= new Date(period.date_start) &&
          startDate <= new Date(period.date_end)
      );

      if (period) {
        setTotalAmount(period.price * numberOfTickets);
      } else {
        setTotalAmount(0); 
      }
    } else {
      setTotalAmount(0);
    }
  }, [startDate, endDate, numberOfTickets, periods]);

  // Permet de gérer les changements de nombres de billets
  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > 0) {
      setNumberOfTickets(value);
    } else {
      toast.error("Le nombre de billets doit être supérieur à zéro.");
    }
  };

  // Gère la soumission de la réservation
  const handleSubmit = async () => {
    if (!user) {
      toast.warning("Veuillez vous connecter pour réserver");
      navigate('/login');
      return;
    }
  
    if (!startDate) {
      toast.error("Veuillez sélectionner une date de début.");
      return;
    }
  
    // Utilisez startDate comme endDate si endDate n'est pas défini (cas d'un seul jour sélectionné)
    const effectiveEndDate = endDate || startDate;
  
    if (numberOfTickets <= 0) {
      toast.error("Veuillez entrer un nombre de billets supérieur à zéro.");
      return;
    }
  
    try {
      const reservationData = {
        date_start: startDate.toISOString().split('T')[0],
        date_end: effectiveEndDate.toISOString().split('T')[0],
        number_tickets: numberOfTickets,
        user_id: user.id,
        period_id: periods.find(
          (period) =>
            startDate >= new Date(period.date_start) &&
            effectiveEndDate <= new Date(period.date_end)
        )?.id,
      };
  
      await createData("/bookings", reservationData);
      toast.success("Réservation enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réservation", error);
      toast.error("Erreur lors de l'enregistrement de la réservation. Veuillez réessayer plus tard.");
    }
  };
  // Gère le cas où aucune période n'est trouvée
  if (isLoading) {
    return (
    <div>
      <p>Chargement en cours...</p>
    </div>
  );
  }

  if (!periods || periods.length === 0) {
    return (
    <div>
      <p>Aucune période disponible pour la réservation.</p>
    </div>
  );
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="text-center pt-10 px-4 sm:px-10 md:px-20">
        <Title>Calendrier</Title>
      </div>

      <div className="flex flex-col xl:flex-row justify-center items-start gap-10 px-4 sm:px-10 md:px-20 mt-10 grow pb-20">
        <div className="w-full xl:w-[60%] flex justify-center">
          <Calendar
            periods={periods}
            onDateSelect={handleDateSelect}
            startDate={startDate}
            endDate={endDate}
            numberOfTickets={numberOfTickets}
          />
        </div>

        <div className="w-full xl:w-[35%] flex justify-center mt-10 xl:mt-0">
          <BookingForm
            startDate={startDate}
            endDate={endDate}
            periods={periods}
            totalAmount={totalAmount}
            numberOfTickets={numberOfTickets}
            onTicketChange={handleTicketChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default UserReservation;
