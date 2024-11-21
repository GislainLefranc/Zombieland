import React, { useState } from "react";
import { format, isSameDay } from 'date-fns';

interface Period {
  id: number;
  name: string;
  date_start: string;
  date_end: string;
  price: number;
}

interface BookingFormProps {
  startDate: Date | null;
  endDate: Date | null;
  periods: Period[];
  totalAmount: number;
  numberOfTickets: number;
  onTicketChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (formData: { firstName: string; lastName: string; numberOfTickets: number; startDate: string; endDate: string }) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  startDate,
  endDate,
  totalAmount,
  numberOfTickets,
  onTicketChange,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const formatDate = (date: Date | null): string => {
    return date ? format(date, 'yyyy-MM-dd') : '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedStartDate = formatDate(startDate);
    let formattedEndDate = formatDate(endDate);

    // Si endDate est null, utilise startDate comme endDate
    if (!endDate && startDate) {
      formattedEndDate = formattedStartDate;
    }

    onSubmit({
      firstName,
      lastName,
      numberOfTickets,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });
  };

  return (
    <div className="bg-black text-white p-5 rounded-lg shadow-lg w-full max-w-md mx-auto mt-5">
      <h2 className="text-2xl font-semibold mb-4 text-center">Réservation</h2>

      {startDate && (
        <div className="mt-5 text-center">
          <p>
            Dates sélectionnées:{" "}
            <strong>
              {formatDate(startDate)}
              {endDate && !isSameDay(startDate, endDate) && ` - ${formatDate(endDate)}`}
            </strong>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mt-5 w-full">
          <label htmlFor="firstName" className="block text-sm font-medium text-center">
            Prénom
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 text-black rounded-md w-full"
            required
          />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="lastName" className="block text-sm font-medium text-center">
            Nom
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 text-black rounded-md w-full"
            required
          />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="tickets" className="block text-sm font-medium text-center">
            Nombre de billets
          </label>
          <input
            id="tickets"
            type="number"
            value={numberOfTickets}
            onChange={onTicketChange}
            className="mt-1 p-2 border border-gray-300 text-black rounded-md w-full"
            min="1"
            required
          />
        </div>

        <div className="mt-5 text-center">
          <p className="text-lg font-semibold">Montant total: {totalAmount}€</p>
        </div>

        <div className="mt-5 w-full">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!startDate || numberOfTickets < 1}
          >
            Réserver
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;