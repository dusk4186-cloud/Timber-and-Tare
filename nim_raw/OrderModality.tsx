Here's an example of a React component for BrewHub Order Modality using Tailwind CSS and Lucide React:

```typescript
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhoneAlt, FaAddressCard } from 'lucide-react';
import { Button, Card, Form, Grid, Input, Label, Modal, Select, Textarea } from 'lucide-react';

interface BrewHubOrderModalityProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BrewHubOrderModalityData) => void;
}

interface BrewHubOrderModalityData {
  pickupDate: string;
  pickupTime: string;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  deliveryApartment: string;
  deliveryCity: string;
  deliveryPinCode: string;
  deliveryWindow: string;
  baristaNotes: string;
}

const BrewHubOrderModality: React.FC<BrewHubOrderModalityProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, errors } = useForm<BrewHubOrderModalityData>();
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryApartment, setDeliveryApartment] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryPinCode, setDeliveryPinCode] = useState('');
  const [deliveryWindow, setDeliveryWindow] = useState('');
  const [baristaNotes, setBaristaNotes] = useState('');

  const handlePickupDateChange = (date: string) => {
    setPickupDate(date);
  };

  const handlePickupTimeChange = (time: string) => {
    setPickupTime(time);
  };

  const handleDeliveryNameChange = (name: string) => {
    setDeliveryName(name);
  };

  const handleDeliveryPhoneChange = (phone: string) => {
    setDeliveryPhone(phone);
  };

  const handleDeliveryAddressChange = (address: string) => {
    setDeliveryAddress(address);
  };

  const handleDeliveryApartmentChange = (apartment: string) => {
    setDeliveryApartment(apartment);
  };

  const handleDeliveryCityChange = (city: string) => {
    setDeliveryCity(city);
  };

  const handleDeliveryPinCodeChange = (pinCode: string) => {
    setDeliveryPinCode(pinCode);
  };

  const handleDeliveryWindowChange = (window: string) => {
    setDeliveryWindow(window);
  };

  const handleBaristaNotesChange = (notes: string) => {
    setBaristaNotes(notes);
  };

  const onSubmitHandler = (data: BrewHubOrderModalityData) => {
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-2xl font-bold">{t('BrewHub Order Modality')}</h2>
      </Modal.Header>
      <Modal.Body className="max-w-5xl mx-auto p-8">
        <Form onSubmit={handleSubmit(onSubmitHandler)}>
          <Grid className="grid-cols-2 gap-8">
            <Card className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">{t('In-Store Pickup')}</h3>
              <div className="flex flex-wrap justify-between">
                <div className="w-full md:w-1/2">
                  <Label className="block text-sm font-medium text-gray-700">
                    {t('Pickup Date')}
                  </Label>
                  <Input
                    type="date"
                    className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={pickupDate}
                    onChange={(e) => handlePickupDateChange(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Label className="block text-sm font-medium text-gray-700">
                    {t('Pickup Time')}
                  </Label>
                  <Select
                    className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={pickupTime}
                    onChange={(e) => handlePickupTimeChange(e.target.value)}
                  >
                    <option value="">Select Time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                  </Select>
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-full md:w-1/2">
                  <Label className="block text-sm font-medium text-gray-700">
                    {t('Roastery Address')}
                  </Label>
                  <Card className="bg-white p-4 rounded-lg shadow-md">
                    <FaMapMarkerAlt className="text-2xl text-gray-400" />
                    <p className="text-sm text-gray-700">
                      123 Main St, Anytown, USA 12345
                    </p>
                  </Card>
                </div>
                <div className="w-full md:w-1/2">
                  <Label className="block text-sm font-medium text-gray-700">
                    {t('Barista Notes')}
                  </Label>
                  <Textarea
                    className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={baristaNotes}
                    onChange={(e) => handleBaristaNotesChange(e.target.value)}
                  />
                </div>
              </div>
            </Card>
            <Card className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">{t('Local Courier Delivery')}</h3>
              <div className="flex flex-wrap justify-between">
                <div className="w-full md:w-1/2">
                  <Label className="block text-sm font-medium text-gray-700">
                    {t('Full Name')}
                  </Label>
                  <Input
                    type="text"
                    className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={deliveryName}
                    onChange={(e) => handleDeliveryNameChange(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Label className="block text-sm font-medium text-gray-700">
                    {t('Phone')}
                  </Label>
                  <Input
                    type="tel"
                    className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={deliveryPhone}
                    onChange={(e) => handleDeliveryPhoneChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-full md:w-1/2">
                  <Label className="block text-sm font-medium text-gray-700">
                    {t('Address')}
                  </