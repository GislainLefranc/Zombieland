//Import des éléments nécessaires
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, isSameDay, addDays } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

//Interface pour définir les périodes qui ont un id, un nom, un date de débutn une date de fin et un prix associé
interface Period {
  id: number;
  name: string;
  date_start: string;
  date_end: string;
  price: number;
}

//Interface pour les propriétés du calendrier qui a les périodes (un tableau), les dates sélectionnées (avec la date de début, de fin ou null), une date de début et de fin et un nombre de tickets
interface CalendarProps {
  periods: Period[];
  onDateSelect: (startDate: Date | null, endDate: Date | null) => void;
  startDate: Date | null;
  endDate: Date | null;
  numberOfTickets: number;
}

//Variable pour définir les couleurs associés au périodes pour les différencier sur le calendrier
const periodColors: { [key: string]: string } = {
  'Basse saison': 'bg-green-200',
  'Moyenne saison': 'bg-orange-200',
  'Haute saison': 'bg-red-200',
};

//Variable pour définir la couleur de la page sélectionnée
const selectedRangeColor = 'bg-blue-300';
//Variable pour définir la couleur des jours sélectionnées (qui sont les dates de début et de fin)
const selectedDateColor = 'bg-blue-600 text-white';
//Variable pour définir la couleur de fond du jour actuel
const todayColor = 'bg-purple-500 text-white';

//Fonction qui permet d'ajouter ou de retirer des class CSS ou autre selon des conditions. Elle accepte un nombre variable d'arguments (...classes), qui peuvent être des chaînes, des booléens ou undefined.
//Elle simplifie la gestion des classes CSS dans les composants React où les classes peuvent changer en fonction de l'état ou des props.
function classNames(...classes: (string | boolean | undefined)[]) {
  // le filter sur les booleens élimine toutes les valeurs falsy (comme false, null, undefined, 0, "") de l'array. et le join concatène ce qu'il reste en 1 seule chaine
  return classes.filter(Boolean).join(' ');
}
//Calendar est un composant fonctionnel de React qui accèpte en props CalendarProps. Il Utilise la syntaxe de déstructuration pour extraire les props spécifiques passées au composant.
const Calendar: React.FC<CalendarProps> = ({ periods, onDateSelect, startDate, endDate }) => {
  //Variable d'état pour la définition d'une date de départ. Crée un nouvel objet Date qui représente le 1er Novembre
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 1));
  //Variable d'état qui permet de définir le prix total et de la mettre à jour via le state, il est de base à 0

  //Fonction pour trouver une période selon une date donnée, elle retourne soit un objet period soit undefines si aucune période n'est associée à cette date
  const getPeriodForDate = (date: Date): Period | undefined => {
    return periods.find(
      //Pour chaque période, elle vérifie si la date donnée est comprise entre la date de début (period.date_start) et la date de fin (period.date_end) de la période.
      //Elle convertir les chaine de date de début et de fin en objet Date. Elle sert à appliquer le bon tarif et la bonne couleur à chaque jour du calendrier en fonction de la période
      (period) => date >= new Date(period.date_start) && date <= new Date(period.date_end)
    );
  };

  //Fonction pour générer un tableau de dates qui représente un mois entier dans le calendrier et rajoute les jours du mois d'avant ou d'après pour compléter
  const getDaysInMonth = (date: Date) => {
    //Trouve le premier jour du mois pour la date donnée.
    const start = startOfMonth(date);
    //Trouve le dernier jour du mois pour la date donnée.
    const end = endOfMonth(date);
    //Crée un tableau contenant tous les jours du mois, du premier au dernier.
    const days = eachDayOfInterval({ start, end });
    //Obtient le jour de la semaine pour le premier jour du mois (0 pour dimanche, 1 pour lundi, etc.).
    const startDay = getDay(start);
    //Calcule combien de jours du mois précédent doivent être ajoutés pour que la semaine commence un lundi.
    const daysToAdd = startDay === 0 ? 6 : startDay - 1;
    //Crée un tableau des jours du mois précédent à ajouter.
    //Utilise Array.from pour créer un tableau de la longueur nécessaire.
    //Pour chaque élément, soustrait le nombre de jours à ajouter du premier jour du mois, puis ajoute l'index actuel.
    const previousMonthDays = Array.from({ length: daysToAdd }, (_, i) => addDays(start, -daysToAdd + i));
    //Combine les jours du mois précédent avec les jours du mois actuel dans un seul tableau.
    return [...previousMonthDays, ...days];
  };

  //Elle utilise la date actuelle (currentDate) qui est stockée dans l'état du composant.
  //Elle appelle la fonction getDaysInMonth avec cette date.
  //days est maintenant un tableau contenant tous les objets Date à afficher dans le calendrier
  const days = getDaysInMonth(currentDate);

  //Fonction pour naviguer vers le mois précédent dans le calendrier
  const goToPreviousMonth = () => {
    //Cette ligne utilise la fonction setCurrentDate pour mettre à jour la date actuelle du calendrier.
    //cette fonction met à jour currentDate pour qu'elle pointe vers le premier jour du mois précédent, permettant ainsi au calendrier d'afficher le mois précédent lorsqu'elle est appelée
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  //Même principe mais pour le mois suivant
  const goToNextMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  //Gère la logique de sélection des dates dans le calendrier, elle prend en param la date sur laquelle l'utilisateur a cliqué.
  const handleDateClick = (date: Date) => {
    //Si une date de début (startDate) est déjà sélectionnée, mais pas de date de fin (endDate)
    if (startDate && !endDate) {
      //Si la date cliquée est la même que la date de début, elle désélectionne tout
      if (isSameDay(date, startDate)) {
        onDateSelect(null, null);
        //Si la date cliquée est avant la date de début, elle inverse le début et la fin
      } else if (date < startDate) {
        onDateSelect(date, startDate);
        //Sinon, elle définit la plage de dates 
      } else {
        onDateSelect(startDate, date);
      }
      //Si une date de début et une date de fin sont déjà sélectionnées
    } else if (startDate && endDate) {
      //Si la date cliquée est la même que la date de début, elle désélectionne tout.
      if (isSameDay(date, startDate)) {
        onDateSelect(null, null);
        //Sinon, elle commence une nouvelle sélection avec la date cliquée comme nouvelle date de début.
      } else {
        onDateSelect(date, null);
      }
      //Si aucune date n'est sélectionnée Elle définit la date cliquée comme date de début.
    } else {
      onDateSelect(date, null);
    }
  };

  //récupère le prix pour une date spécifique. Elle est utilisée pour afficher le prix sous chaque jour dans le calendrier. 
  //Si aucune période n'est trouvée pour la date, elle retourne une chaîne vide.
  const getPeriodPrice = (date: Date) => {
    const period = getPeriodForDate(date);
    return period ? `${period.price}€` : '';
  };

  //vérifie si une date donnée est dans la plage de dates sélectionnée. Elle est utilisée pour appliquer un style visuel aux dates comprises 
  //entre la date de début et la date de fin sélectionnées.
  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  //vérifie si une date est soit la date de début, soit la date de fin de la plage sélectionnée. 
  //Elle est utilisée pour appliquer un style spécifique aux dates de début et de fin de la sélection.
  const isStartOrEndDate = (date: Date) => {
    return (startDate && isSameDay(date, startDate)) || (endDate && isSameDay(date, endDate));
  };

  return (
    <div className="bg-black w-screen h-600">
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
        <div className="md:pr-14">
          <div className="flex items-center">
            <h2 className="flex-auto text-sm font-semibold text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button type="button" onClick={goToPreviousMonth} className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={goToNextMonth} className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-white">
            <div>L</div>
            <div>M</div>
            <div>M</div>
            <div>J</div>
            <div>V</div>
            <div>S</div>
            <div>D</div>
          </div>
          <div className="mt-2 grid grid-cols-7 text-sm">
            {days.map((day) => {
              const period = getPeriodForDate(day);
              const isInRange = isDateInRange(day);
              const isSelected = isStartOrEndDate(day);
              const price = getPeriodPrice(day);
              const periodBackgroundColor = period ? periodColors[period.name] : '';
              const backgroundColor = isSelected ? selectedDateColor : isInRange ? selectedRangeColor : periodBackgroundColor;
              const finalBackgroundColor = isToday(day) ? todayColor : backgroundColor;

              return (
                <div key={day.toString()} className="py-2">
                  <button
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={classNames(
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                      finalBackgroundColor,
                      isToday(day) ? 'text-white' : '',
                      isSameMonth(day, currentDate) ? 'text-gray-900' : 'text-gray-400'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                  </button>
                  {price && <div className="text-xs mt-1 text-center text-white">{price}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="md:pl-14 pt-5">
          <h3 className="text-white font-semibold">Légende</h3>
          <ul className="text-white text-xs mt-4 space-y-2">
            <li className="flex items-center">
              <div className="w-4 h-4 bg-red-200 rounded-full mr-2" /> Haute Saison
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-orange-200 rounded-full mr-2" /> Moyenne Saison
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-green-200 rounded-full mr-2" /> Basse Saison
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-blue-300 rounded-full mr-2" /> Plage de Dates Sélectionnées
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-2" /> Date de Début / Date de Fin
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-2" /> Jour Actuel
            </li>
          </ul>
          
        </div>
      </div>
    </div>
  );
};

export default Calendar;