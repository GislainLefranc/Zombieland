import React from 'react';
import { render } from '@testing-library/react';
import CreateQuoteModal from '../CreateQuoteModal';

test('Vérifiez que initialData est correctement défini et que toutes les propriétés utilisées existent dans le type QuoteEquipmentLine', () => {
    const initialData = {
        engagement_duration: 12,
        interlocutor_ids: [1],
    };

    const { getByText } = render(<CreateQuoteModal initialData={initialData} isOpen={true} onClose={() => {}} />);

    expect(getByText('Créer')).toBeInTheDocument();
});

test('Modifiez les références à equipment pour utiliser equipment_id à la place', () => {
    const mockEquipment = { equipment_id: 1, price_ht: 100 };
    const initialData = {
        engagement_duration: 12,
        interlocutor_ids: [1],
        equipment: [mockEquipment],
    };

    const { getByText } = render(<CreateQuoteModal initialData={initialData} isOpen={true} onClose={() => {}} />);

    expect(getByText('Créer')).toBeInTheDocument();
});