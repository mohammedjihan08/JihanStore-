import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  WebsiteSettings,
  ContactPhoneEntry,
  ContactEmailEntry,
  BusinessAddressEntry,
  MobileBankingAccount,
  BankAccountEntry,
  MobileBankingType,
  DeliveryAreaRule
} from '../../types';
import { Button, Input, Textarea, Modal } from '../../components/common/UI';
import { BANGLADESH_DIVISIONS } from '../../data/bangladeshLocations';
import { AdminTelegramPage } from './AdminTelegramPage';
import {
  Settings,
  Save,
  Store,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Building2,
  Globe,
  Truck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Star,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock,
  Send
} from 'lucide-react';

export const AdminWebsiteSettingsPage: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();
  const [form, setForm] = useState<WebsiteSettings>(() => ({
    ...settings,
    phoneNumbers: settings.phoneNumbers || [],
    emailAddresses: settings.emailAddresses || [],
    businessAddresses: settings.businessAddresses || [],
    bkashAccounts: settings.bkashAccounts || [],
    nagadAccounts: settings.nagadAccounts || [],
    rocketAccounts: settings.rocketAccounts || [],
    upayAccounts: settings.upayAccounts || [],
    bankAccounts: settings.bankAccounts || [],
    deliveryRules: settings.deliveryRules || [],
    defaultDeliveryCharge: typeof settings.defaultDeliveryCharge === 'number' ? settings.defaultDeliveryCharge : 130
  }));

  const [activeTab, setActiveTab] = useState<'delivery' | 'payment' | 'telegram' | 'contact' | 'identity' | 'shipping'>('delivery');

  // Modals state for Adding / Editing entries
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<ContactPhoneEntry | null>(null);
  const [phoneForm, setPhoneForm] = useState({ number: '', label: '', isActive: true, isDefault: false });

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<ContactEmailEntry | null>(null);
  const [emailForm, setEmailForm] = useState({ email: '', label: '', isActive: true, isDefault: false });

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<BusinessAddressEntry | null>(null);
  const [addressForm, setAddressForm] = useState({ title: '', address: '', city: 'Dhaka', isActive: true, isDefault: false });

  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [mobileProvider, setMobileProvider] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay'>('bKash');
  const [editingMobile, setEditingMobile] = useState<MobileBankingAccount | null>(null);
  const [mobileForm, setMobileForm] = useState<{
    accountNumber: string;
    accountType: MobileBankingType;
    label: string;
    instructions: string;
    isActive: boolean;
    isDefault: boolean;
  }>({
    accountNumber: '',
    accountType: 'Personal',
    label: '',
    instructions: '',
    isActive: true,
    isDefault: false
  });

  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccountEntry | null>(null);
  const [bankForm, setBankForm] = useState<{
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    routingNumber: string;
    instructions: string;
    isActive: boolean;
    isDefault: boolean;
  }>({
    bankName: '',
    accountName: '',
    accountNumber: '',
    branch: '',
    routingNumber: '',
    instructions: '',
    isActive: true,
    isDefault: false
  });

  // Delivery Rule Modal State
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [editingDeliveryRule, setEditingDeliveryRule] = useState<DeliveryAreaRule | null>(null);
  const [deliveryForm, setDeliveryForm] = useState<{
    name: string;
    division: string;
    district: string;
    area: string;
    deliveryCharge: number;
    isFreeDelivery: boolean;
    minOrderAmount: number;
    estimatedDays: string;
    isActive: boolean;
    isDefault: boolean;
    notes: string;
  }>({
    name: '',
    division: 'Chittagong',
    district: 'Chittagong',
    area: '',
    deliveryCharge: 130,
    isFreeDelivery: false,
    minOrderAmount: 0,
    estimatedDays: '২-৩ কার্যদিবস',
    isActive: true,
    isDefault: false,
    notes: ''
  });

  // Save full settings form
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(form);
    showToast('সকল তথ্য, ডেলিভারি চার্জ ও সেটিংস সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!');
  };

  // -------------------------------------------------------------
  // DELIVERY AREA RULES HANDLERS
  // -------------------------------------------------------------
  const openAddDeliveryRule = () => {
    setEditingDeliveryRule(null);
    setDeliveryForm({
      name: '',
      division: 'Chittagong',
      district: 'Chittagong',
      area: '',
      deliveryCharge: 130,
      isFreeDelivery: false,
      minOrderAmount: 0,
      estimatedDays: '২-৩ কার্যদিবস',
      isActive: true,
      isDefault: false,
      notes: ''
    });
    setDeliveryModalOpen(true);
  };

  const openEditDeliveryRule = (rule: DeliveryAreaRule) => {
    setEditingDeliveryRule(rule);
    setDeliveryForm({
      name: rule.name,
      division: rule.division || 'All',
      district: rule.district || 'All',
      area: rule.area || '',
      deliveryCharge: rule.deliveryCharge,
      isFreeDelivery: rule.isFreeDelivery,
      minOrderAmount: rule.minOrderAmount || 0,
      estimatedDays: rule.estimatedDays || '২-৩ কার্যদিবস',
      isActive: rule.isActive,
      isDefault: !!rule.isDefault,
      notes: rule.notes || ''
    });
    setDeliveryModalOpen(true);
  };

  const handleSaveDeliveryRule = (e: React.FormEvent) => {
    e.preventDefault();
    const ruleTitle = deliveryForm.name.trim() || `${deliveryForm.district}${deliveryForm.area ? ' - ' + deliveryForm.area : ''}`;
    const finalCharge = deliveryForm.isFreeDelivery ? 0 : Math.max(0, deliveryForm.deliveryCharge);

    let updated: DeliveryAreaRule[];
    if (editingDeliveryRule) {
      updated = form.deliveryRules.map(r => {
        if (r.id === editingDeliveryRule.id) {
          return {
            ...r,
            name: ruleTitle,
            division: deliveryForm.division,
            district: deliveryForm.district,
            area: deliveryForm.area.trim(),
            deliveryCharge: finalCharge,
            isFreeDelivery: deliveryForm.isFreeDelivery,
            minOrderAmount: deliveryForm.minOrderAmount || undefined,
            estimatedDays: deliveryForm.estimatedDays.trim(),
            isActive: deliveryForm.isActive,
            isDefault: deliveryForm.isDefault,
            notes: deliveryForm.notes.trim()
          };
        }
        return deliveryForm.isDefault ? { ...r, isDefault: false } : r;
      });
    } else {
      const newRule: DeliveryAreaRule = {
        id: `del-${Date.now()}`,
        name: ruleTitle,
        division: deliveryForm.division,
        district: deliveryForm.district,
        area: deliveryForm.area.trim(),
        deliveryCharge: finalCharge,
        isFreeDelivery: deliveryForm.isFreeDelivery,
        minOrderAmount: deliveryForm.minOrderAmount || undefined,
        estimatedDays: deliveryForm.estimatedDays.trim() || '২-৩ কার্যদিবস',
        isActive: deliveryForm.isActive,
        isDefault: deliveryForm.isDefault,
        notes: deliveryForm.notes.trim()
      };
      updated = deliveryForm.isDefault
        ? [...form.deliveryRules.map(r => ({ ...r, isDefault: false })), newRule]
        : [...form.deliveryRules, newRule];
    }

    const nextForm = { ...form, deliveryRules: updated };
    setForm(nextForm);
    updateSettings(nextForm);
    setDeliveryModalOpen(false);
  };

  const handleDeleteDeliveryRule = (id: string) => {
    const updated = form.deliveryRules.filter(r => r.id !== id);
    const nextForm = { ...form, deliveryRules: updated };
    setForm(nextForm);
    updateSettings(nextForm);
    showToast('ডেলিভারি এরিয়া সফলভাবে ডিলিট করা হয়েছে');
  };

  const handleToggleDeliveryActive = (id: string) => {
    const updated = form.deliveryRules.map(r =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    const nextForm = { ...form, deliveryRules: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  const handleToggleFreeDelivery = (id: string) => {
    const updated = form.deliveryRules.map(r => {
      if (r.id === id) {
        const nextFree = !r.isFreeDelivery;
        return {
          ...r,
          isFreeDelivery: nextFree,
          deliveryCharge: nextFree ? 0 : (r.deliveryCharge === 0 ? 130 : r.deliveryCharge)
        };
      }
      return r;
    });
    const nextForm = { ...form, deliveryRules: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  // -------------------------------------------------------------
  // PHONE NUMBERS HANDLERS
  // -------------------------------------------------------------
  const openAddPhone = () => {
    setEditingPhone(null);
    setPhoneForm({
      number: '',
      label: 'হটলাইন ও সরাসরি কল (Main Helpline)',
      isActive: true,
      isDefault: form.phoneNumbers.length === 0
    });
    setPhoneModalOpen(true);
  };

  const openEditPhone = (p: ContactPhoneEntry) => {
    setEditingPhone(p);
    setPhoneForm({
      number: p.number,
      label: p.label || '',
      isActive: p.isActive,
      isDefault: p.isDefault
    });
    setPhoneModalOpen(true);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneForm.number.trim()) return;

    let updated: ContactPhoneEntry[];
    if (editingPhone) {
      updated = form.phoneNumbers.map(p => {
        if (p.id === editingPhone.id) {
          return {
            ...p,
            number: phoneForm.number.trim(),
            label: phoneForm.label.trim(),
            isActive: phoneForm.isActive,
            isDefault: phoneForm.isDefault
          };
        }
        return phoneForm.isDefault ? { ...p, isDefault: false } : p;
      });
    } else {
      const newEntry: ContactPhoneEntry = {
        id: `ph-${Date.now()}`,
        number: phoneForm.number.trim(),
        label: phoneForm.label.trim(),
        isActive: phoneForm.isActive,
        isDefault: phoneForm.isDefault || form.phoneNumbers.length === 0
      };
      updated = phoneForm.isDefault
        ? [...form.phoneNumbers.map(p => ({ ...p, isDefault: false })), newEntry]
        : [...form.phoneNumbers, newEntry];
    }

    const nextForm = { ...form, phoneNumbers: updated };
    setForm(nextForm);
    updateSettings(nextForm);
    setPhoneModalOpen(false);
  };

  const handleDeletePhone = (id: string) => {
    if (form.phoneNumbers.length <= 1) {
      showToast('অন্তত একটি ফোন নম্বর থাকা আবশ্যক।');
      return;
    }
    const updated = form.phoneNumbers.filter(p => p.id !== id);
    if (!updated.some(p => p.isDefault) && updated.length > 0) {
      updated[0].isDefault = true;
    }
    const nextForm = { ...form, phoneNumbers: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  const handleTogglePhoneActive = (id: string) => {
    const updated = form.phoneNumbers.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    const nextForm = { ...form, phoneNumbers: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  const handleSetDefaultPhone = (id: string) => {
    const updated = form.phoneNumbers.map(p => ({
      ...p,
      isDefault: p.id === id,
      isActive: p.id === id ? true : p.isActive
    }));
    const nextForm = { ...form, phoneNumbers: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  // -------------------------------------------------------------
  // EMAIL ADDRESSES HANDLERS
  // -------------------------------------------------------------
  const openAddEmail = () => {
    setEditingEmail(null);
    setEmailForm({
      email: '',
      label: 'গ্রাহক সেবা (Customer Support)',
      isActive: true,
      isDefault: form.emailAddresses.length === 0
    });
    setEmailModalOpen(true);
  };

  const openEditEmail = (item: ContactEmailEntry) => {
    setEditingEmail(item);
    setEmailForm({
      email: item.email,
      label: item.label || '',
      isActive: item.isActive,
      isDefault: item.isDefault
    });
    setEmailModalOpen(true);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.email.trim()) return;

    let updated: ContactEmailEntry[];
    if (editingEmail) {
      updated = form.emailAddresses.map(item => {
        if (item.id === editingEmail.id) {
          return {
            ...item,
            email: emailForm.email.trim(),
            label: emailForm.label.trim(),
            isActive: emailForm.isActive,
            isDefault: emailForm.isDefault
          };
        }
        return emailForm.isDefault ? { ...item, isDefault: false } : item;
      });
    } else {
      const newEntry: ContactEmailEntry = {
        id: `em-${Date.now()}`,
        email: emailForm.email.trim(),
        label: emailForm.label.trim(),
        isActive: emailForm.isActive,
        isDefault: emailForm.isDefault || form.emailAddresses.length === 0
      };
      updated = emailForm.isDefault
        ? [...form.emailAddresses.map(em => ({ ...em, isDefault: false })), newEntry]
        : [...form.emailAddresses, newEntry];
    }

    const nextForm = { ...form, emailAddresses: updated };
    setForm(nextForm);
    updateSettings(nextForm);
    setEmailModalOpen(false);
  };

  const handleDeleteEmail = (id: string) => {
    if (form.emailAddresses.length <= 1) {
      showToast('অন্তত একটি ইমেইল থাকা আবশ্যক।');
      return;
    }
    const updated = form.emailAddresses.filter(e => e.id !== id);
    if (!updated.some(e => e.isDefault) && updated.length > 0) {
      updated[0].isDefault = true;
    }
    const nextForm = { ...form, emailAddresses: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  const handleToggleEmailActive = (id: string) => {
    const updated = form.emailAddresses.map(e =>
      e.id === id ? { ...e, isActive: !e.isActive } : e
    );
    const nextForm = { ...form, emailAddresses: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  const handleSetDefaultEmail = (id: string) => {
    const updated = form.emailAddresses.map(e => ({
      ...e,
      isDefault: e.id === id,
      isActive: e.id === id ? true : e.isActive
    }));
    const nextForm = { ...form, emailAddresses: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  // -------------------------------------------------------------
  // BUSINESS ADDRESSES HANDLERS
  // -------------------------------------------------------------
  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      title: 'নতুন শাখা / আউটলেট',
      address: '',
      city: 'Sandwip, Chittagong',
      isActive: true,
      isDefault: form.businessAddresses.length === 0
    });
    setAddressModalOpen(true);
  };

  const openEditAddress = (item: BusinessAddressEntry) => {
    setEditingAddress(item);
    setAddressForm({
      title: item.title,
      address: item.address,
      city: item.city || '',
      isActive: item.isActive,
      isDefault: item.isDefault
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.address.trim()) return;

    let updated: BusinessAddressEntry[];
    if (editingAddress) {
      updated = form.businessAddresses.map(item => {
        if (item.id === editingAddress.id) {
          return {
            ...item,
            title: addressForm.title.trim(),
            address: addressForm.address.trim(),
            city: addressForm.city.trim(),
            isActive: addressForm.isActive,
            isDefault: addressForm.isDefault
          };
        }
        return addressForm.isDefault ? { ...item, isDefault: false } : item;
      });
    } else {
      const newEntry: BusinessAddressEntry = {
        id: `addr-${Date.now()}`,
        title: addressForm.title.trim(),
        address: addressForm.address.trim(),
        city: addressForm.city.trim(),
        isActive: addressForm.isActive,
        isDefault: addressForm.isDefault || form.businessAddresses.length === 0
      };
      updated = addressForm.isDefault
        ? [...form.businessAddresses.map(a => ({ ...a, isDefault: false })), newEntry]
        : [...form.businessAddresses, newEntry];
    }

    const nextForm = { ...form, businessAddresses: updated };
    setForm(nextForm);
    updateSettings(nextForm);
    setAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    if (form.businessAddresses.length <= 1) {
      showToast('অন্তত একটি ঠিকানা থাকা আবশ্যক।');
      return;
    }
    const updated = form.businessAddresses.filter(a => a.id !== id);
    if (!updated.some(a => a.isDefault) && updated.length > 0) {
      updated[0].isDefault = true;
    }
    const nextForm = { ...form, businessAddresses: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  const handleToggleAddressActive = (id: string) => {
    const updated = form.businessAddresses.map(a =>
      a.id === id ? { ...a, isActive: !a.isActive } : a
    );
    const nextForm = { ...form, businessAddresses: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = form.businessAddresses.map(a => ({
      ...a,
      isDefault: a.id === id,
      isActive: a.id === id ? true : a.isActive
    }));
    const nextForm = { ...form, businessAddresses: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  // -------------------------------------------------------------
  // MOBILE BANKING HANDLERS (bKash, Nagad, Rocket, Upay)
  // -------------------------------------------------------------
  const getMobileList = (provider: 'bKash' | 'Nagad' | 'Rocket' | 'Upay'): MobileBankingAccount[] => {
    switch (provider) {
      case 'bKash': return form.bkashAccounts;
      case 'Nagad': return form.nagadAccounts;
      case 'Rocket': return form.rocketAccounts;
      case 'Upay': return form.upayAccounts;
    }
  };

  const updateMobileList = (provider: 'bKash' | 'Nagad' | 'Rocket' | 'Upay', list: MobileBankingAccount[]) => {
    const nextForm = {
      ...form,
      [provider === 'bKash' ? 'bkashAccounts' : provider === 'Nagad' ? 'nagadAccounts' : provider === 'Rocket' ? 'rocketAccounts' : 'upayAccounts']: list
    };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  const openAddMobile = (provider: 'bKash' | 'Nagad' | 'Rocket' | 'Upay') => {
    setMobileProvider(provider);
    setEditingMobile(null);
    setMobileForm({
      accountNumber: '01867-841638',
      accountType: 'Personal',
      label: `${provider} Personal (Send Money)`,
      instructions: `${provider} অ্যাপ বা ডায়াল করে Send Money করুন এবং TrxID লিখুন।`,
      isActive: true,
      isDefault: getMobileList(provider).length === 0
    });
    setMobileModalOpen(true);
  };

  const openEditMobile = (item: MobileBankingAccount) => {
    setMobileProvider(item.provider);
    setEditingMobile(item);
    setMobileForm({
      accountNumber: item.accountNumber,
      accountType: item.accountType,
      label: item.label || '',
      instructions: item.instructions || '',
      isActive: item.isActive,
      isDefault: item.isDefault
    });
    setMobileModalOpen(true);
  };

  const handleSaveMobile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileForm.accountNumber.trim()) return;

    const list = getMobileList(mobileProvider);
    let updated: MobileBankingAccount[];

    if (editingMobile) {
      updated = list.map(item => {
        if (item.id === editingMobile.id) {
          return {
            ...item,
            accountNumber: mobileForm.accountNumber.trim(),
            accountType: mobileForm.accountType,
            label: mobileForm.label.trim() || `${mobileProvider} ${mobileForm.accountType}`,
            instructions: mobileForm.instructions.trim(),
            isActive: mobileForm.isActive,
            isDefault: mobileForm.isDefault
          };
        }
        return mobileForm.isDefault ? { ...item, isDefault: false } : item;
      });
    } else {
      const newEntry: MobileBankingAccount = {
        id: `mob-${Date.now()}`,
        provider: mobileProvider,
        accountNumber: mobileForm.accountNumber.trim(),
        accountType: mobileForm.accountType,
        label: mobileForm.label.trim() || `${mobileProvider} ${mobileForm.accountType}`,
        instructions: mobileForm.instructions.trim(),
        isActive: mobileForm.isActive,
        isDefault: mobileForm.isDefault || list.length === 0
      };
      updated = mobileForm.isDefault
        ? [...list.map(m => ({ ...m, isDefault: false })), newEntry]
        : [...list, newEntry];
    }

    updateMobileList(mobileProvider, updated);
    setMobileModalOpen(false);
  };

  const handleDeleteMobile = (provider: 'bKash' | 'Nagad' | 'Rocket' | 'Upay', id: string) => {
    const list = getMobileList(provider).filter(m => m.id !== id);
    if (!list.some(m => m.isDefault) && list.length > 0) {
      list[0].isDefault = true;
    }
    updateMobileList(provider, list);
  };

  const handleToggleMobileActive = (provider: 'bKash' | 'Nagad' | 'Rocket' | 'Upay', id: string) => {
    const list = getMobileList(provider).map(m =>
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    updateMobileList(provider, list);
  };

  const handleSetDefaultMobile = (provider: 'bKash' | 'Nagad' | 'Rocket' | 'Upay', id: string) => {
    const list = getMobileList(provider).map(m => ({
      ...m,
      isDefault: m.id === id,
      isActive: m.id === id ? true : m.isActive
    }));
    updateMobileList(provider, list);
  };

  // -------------------------------------------------------------
  // BANK ACCOUNTS HANDLERS
  // -------------------------------------------------------------
  const openAddBank = () => {
    setEditingBank(null);
    setBankForm({
      bankName: 'Islami Bank Bangladesh PLC',
      accountName: 'Jihan Store',
      accountNumber: '20503610200000000',
      branch: 'Sandwip Branch, Chittagong',
      routingNumber: '125271234',
      instructions: 'অনলাইন ফান্ড ট্রান্সফার বা ব্রাঞ্চে ডিপোজিট করে রেফারেন্স দিন।',
      isActive: true,
      isDefault: form.bankAccounts.length === 0
    });
    setBankModalOpen(true);
  };

  const openEditBank = (item: BankAccountEntry) => {
    setEditingBank(item);
    setBankForm({
      bankName: item.bankName,
      accountName: item.accountName,
      accountNumber: item.accountNumber,
      branch: item.branch,
      routingNumber: item.routingNumber || '',
      instructions: item.instructions || '',
      isActive: item.isActive,
      isDefault: item.isDefault
    });
    setBankModalOpen(true);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.bankName.trim() || !bankForm.accountNumber.trim()) return;

    let updated: BankAccountEntry[];
    if (editingBank) {
      updated = form.bankAccounts.map(item => {
        if (item.id === editingBank.id) {
          return {
            ...item,
            bankName: bankForm.bankName.trim(),
            accountName: bankForm.accountName.trim(),
            accountNumber: bankForm.accountNumber.trim(),
            branch: bankForm.branch.trim(),
            routingNumber: bankForm.routingNumber.trim(),
            instructions: bankForm.instructions.trim(),
            isActive: bankForm.isActive,
            isDefault: bankForm.isDefault
          };
        }
        return bankForm.isDefault ? { ...item, isDefault: false } : item;
      });
    } else {
      const newEntry: BankAccountEntry = {
        id: `bnk-${Date.now()}`,
        bankName: bankForm.bankName.trim(),
        accountName: bankForm.accountName.trim(),
        accountNumber: bankForm.accountNumber.trim(),
        branch: bankForm.branch.trim(),
        routingNumber: bankForm.routingNumber.trim(),
        instructions: bankForm.instructions.trim(),
        isActive: bankForm.isActive,
        isDefault: bankForm.isDefault || form.bankAccounts.length === 0
      };
      updated = bankForm.isDefault
        ? [...form.bankAccounts.map(b => ({ ...b, isDefault: false })), newEntry]
        : [...form.bankAccounts, newEntry];
    }

    const nextForm = { ...form, bankAccounts: updated };
    setForm(nextForm);
    updateSettings(nextForm);
    setBankModalOpen(false);
  };

  const handleDeleteBank = (id: string) => {
    const updated = form.bankAccounts.filter(b => b.id !== id);
    if (!updated.some(b => b.isDefault) && updated.length > 0) {
      updated[0].isDefault = true;
    }
    const nextForm = { ...form, bankAccounts: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  const handleToggleBankActive = (id: string) => {
    const updated = form.bankAccounts.map(b =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    );
    const nextForm = { ...form, bankAccounts: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  const handleSetDefaultBank = (id: string) => {
    const updated = form.bankAccounts.map(b => ({
      ...b,
      isDefault: b.id === id,
      isActive: b.id === id ? true : b.isActive
    }));
    const nextForm = { ...form, bankAccounts: updated };
    setForm(nextForm);
    updateSettings(nextForm);
  };

  // Find districts for selected division in delivery modal (or all districts if All is selected)
  const selectedDivObj = BANGLADESH_DIVISIONS.find(d => d.name === deliveryForm.division);
  const availableDistricts = selectedDivObj
    ? selectedDivObj.districts
    : BANGLADESH_DIVISIONS.flatMap(d => d.districts);
  const selectedDistObj = availableDistricts.find(d => d.name === deliveryForm.district);
  const availableUpazilas = selectedDistObj ? selectedDistObj.upazilas || [] : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Header & Sticky Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>পেমেন্ট, ডেলিভারি ও ওয়েবসাইট সেটিংস</span>
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
              Location-Based System
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            সন্দ্বীপ, চট্টগ্রাম, ঢাকাসহ যেকোনো জেলা/উপজেলা অনুযায়ী কাস্টম ডেলিভারি চার্জ ও ফ্রি ডেলিভারি নিয়ন্ত্রণ করুন
          </p>
        </div>

        <Button
          onClick={() => handleSaveAll()}
          variant="gold"
          size="md"
          className="gap-2 font-bold shadow-md shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>সকল সেটিংস সংরক্ষণ করুন (Save All)</span>
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'delivery'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4 text-amber-400" />
          <span>ডেলিভারি এরিয়া ও চার্জ ({(form.deliveryRules || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'payment'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span>পেমেন্ট অ্যাকাউন্টসমূহ ({form.bkashAccounts.length + form.nagadAccounts.length + form.rocketAccounts.length + form.upayAccounts.length + form.bankAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'telegram'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Send className="w-4 h-4 text-amber-400" />
          <span>টেলিগ্রাম ২-বট রোটেশন</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Phone className="w-4 h-4 text-amber-400" />
          <span>যোগাযোগ ও ঠিকানা ({form.phoneNumbers.length + form.emailAddresses.length + form.businessAddresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'identity'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4 text-amber-400" />
          <span>স্টোর পরিচিতি ও পলিসি</span>
        </button>

        <button
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'shipping'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 text-amber-400" />
          <span>সোশ্যাল ও সাধারণ সেটিংস</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB: LOCATION-BASED DELIVERY CHARGE MANAGEMENT                  */}
      {/* ============================================================== */}
      {activeTab === 'delivery' && (
        <div className="space-y-6">
          {/* Information & Capability Banner */}
          <div className="p-4 bg-linear-to-r from-blue-900 to-blue-950 text-white rounded-2xl shadow-sm border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">অ্যাডভান্সড লোকেশন ভিত্তিক ডেলিভারি চার্জ সিস্টেম</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                আপনি যেকোনো জেলা বা উপজেলার জন্য আলাদা ডেলিভারি চার্জ (যেমন: Sandwip → FREE, Chittagong → ৳130 বা ৳80, Dhaka → ৳130 বা ৳100) সেট করতে পারেন। কাস্টমার চেকআউটে জেলা নির্বাচন করলে স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট চার্জ প্রদর্শিত হবে।
              </p>
            </div>

            <Button
              size="md"
              variant="gold"
              onClick={openAddDeliveryRule}
              className="gap-2 font-bold shrink-0 self-start md:self-auto cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Delivery Area</span>
            </Button>
          </div>

          {/* Quick Fallback Configuration Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 block">অন্যান্য অনির্দিষ্ট জেলার সাধারণ ডেলিভারি চার্জ (Default Fallback Rate)</span>
              <span className="text-slate-500">যদি কোনো নির্দিষ্ট জেলার রুল যোগ না থাকে, তবে স্বয়ংক্রিয়ভাবে এই চার্জটি প্রযোজ্য হবে</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">BDT ৳</span>
              <input
                type="number"
                value={form.defaultDeliveryCharge}
                onChange={e => {
                  const val = parseFloat(e.target.value) || 0;
                  setForm({ ...form, defaultDeliveryCharge: val });
                }}
                className="w-24 p-1.5 border border-slate-300 rounded-lg text-sm font-mono font-bold text-blue-950 bg-slate-50 text-center"
              />
            </div>
          </div>

          {/* Delivery Area Rules List */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>কনফিগারকৃত ডেলিভারি এরিয়াসমূহ</span>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded">
                  {(form.deliveryRules || []).length} টি এরিয়া
                </span>
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={openAddDeliveryRule}
                className="gap-1.5 text-xs border-blue-300 text-blue-900 hover:bg-blue-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন এরিয়া যোগ করুন</span>
              </Button>
            </div>

            {(form.deliveryRules || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">কোনো ডেলিভারি এরিয়া নেই। &apos;+ Add Delivery Area&apos; বাটনে ক্লিক করে যোগ করুন।</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(form.deliveryRules || []).map(rule => (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                      rule.isActive
                        ? rule.isFreeDelivery
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-blue-200 bg-blue-50/15'
                        : 'border-slate-200 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{rule.name}</h4>
                            {rule.isDefault && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-mono">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span>বিভাগ: {rule.division}</span>
                            <span>·</span>
                            <span>জেলা: {rule.district}</span>
                            {rule.area && rule.area !== 'All' && (
                              <>
                                <span>·</span>
                                <span className="text-blue-900 font-semibold">{rule.area}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                              rule.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {rule.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                      </div>

                      {/* Charge Display */}
                      <div className="p-3 bg-white rounded-lg border border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">নির্ধারিত ডেলিভারি চার্জ:</span>
                        <div className="flex items-center gap-2">
                          {rule.isFreeDelivery ? (
                            <span className="text-xs font-black font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              FREE DELIVERY (৳০)
                            </span>
                          ) : (
                            <span className="text-base font-black font-mono text-blue-950">
                              ৳{rule.deliveryCharge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rule.estimatedDays || '২-৩ কার্যদিবস'}</span>
                        </span>
                        {rule.minOrderAmount && rule.minOrderAmount > 0 && (
                          <span className="font-semibold text-emerald-700">
                            (৳{rule.minOrderAmount}+ অর্ডারে ফ্রি)
                          </span>
                        )}
                      </div>

                      {rule.notes && (
                        <p className="text-[11px] text-slate-500 bg-white/80 p-2 rounded border border-slate-100 italic">
                          {rule.notes}
                        </p>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleDeliveryActive(rule.id)}
                          className={`font-semibold cursor-pointer ${
                            rule.isActive ? 'text-amber-700 hover:underline' : 'text-emerald-700 hover:underline'
                          }`}
                        >
                          {rule.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => handleToggleFreeDelivery(rule.id)}
                          className={`font-semibold cursor-pointer ${
                            rule.isFreeDelivery ? 'text-blue-900 hover:underline' : 'text-emerald-700 hover:underline'
                          }`}
                        >
                          {rule.isFreeDelivery ? 'চার্জ প্রযোজ্য করুন' : 'ফ্রি ডেলিভারি করুন'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditDeliveryRule(rule)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDeliveryRule(rule.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: PAYMENT METHODS (BKASH, NAGAD, ROCKET, UPAY, BANK)        */}
      {/* ============================================================== */}
      {activeTab === 'payment' && (
        <div className="space-y-8">
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-950">
            <Info className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-sm block">পেমেন্ট মেথড মাল্টিপল অ্যাকাউন্ট সুবিধা</span>
              <p className="text-[11px] leading-relaxed text-blue-900">
                এখানে আপনি যতগুলো প্রয়োজন ততগুলো বিকাশ, নগদ, রকেট, উপায় এবং ব্যাংক অ্যাকাউন্ট যোগ করতে পারবেন। কাস্টমার চেকআউট পেজে শুধুমাত্র <strong>সক্রিয় (Active)</strong> অ্যাকাউন্টগুলো স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।
              </p>
            </div>
          </div>

          {/* bKash Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center font-bold text-pink-600 text-xs font-mono">
                  bK
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">বিকাশ অ্যাকাউন্টসমূহ (bKash Accounts)</h3>
                  <span className="text-[11px] text-slate-400">পার্সোনাল, মার্চেন্ট ও এজেন্ট অ্যাকাউন্টসমূহ</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openAddMobile('bKash')}
                className="gap-1.5 border-pink-300 text-pink-800 hover:bg-pink-50 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন বিকাশ অ্যাকাউন্ট যোগ করুন</span>
              </Button>
            </div>

            {form.bkashAccounts.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">কোনো বিকাশ অ্যাকাউন্ট যোগ করা হয়নি।</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {form.bkashAccounts.map(account => (
                  <div
                    key={account.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      account.isActive
                        ? 'border-pink-200 bg-pink-50/20'
                        : 'border-slate-200 bg-slate-50 opacity-70'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {account.accountNumber}
                        </span>
                        <div className="flex items-center gap-1">
                          {account.isDefault && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              DEFAULT
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                              account.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {account.isActive ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-pink-700 bg-pink-100/60 px-2 py-0.5 rounded">
                          {account.accountType}
                        </span>
                        <span className="text-slate-600 truncate">{account.label}</span>
                      </div>

                      {account.instructions && (
                        <p className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-100 mt-1">
                          {account.instructions}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleMobileActive('bKash', account.id)}
                          className={`font-semibold cursor-pointer ${
                            account.isActive ? 'text-amber-700 hover:underline' : 'text-emerald-700 hover:underline'
                          }`}
                        >
                          {account.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                        </button>
                        {!account.isDefault && (
                          <>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={() => handleSetDefaultMobile('bKash', account.id)}
                              className="text-blue-900 font-semibold hover:underline cursor-pointer"
                            >
                              ডিফল্ট করুন
                            </button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditMobile(account)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMobile('bKash', account.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nagad Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-orange-600 text-xs font-mono">
                  NG
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">নগদ অ্যাকাউন্টসমূহ (Nagad Accounts)</h3>
                  <span className="text-[11px] text-slate-400">পার্সোনাল ও মার্চেন্ট নগদ ওয়ালেট</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openAddMobile('Nagad')}
                className="gap-1.5 border-orange-300 text-orange-800 hover:bg-orange-50 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন নগদ অ্যাকাউন্ট যোগ করুন</span>
              </Button>
            </div>

            {form.nagadAccounts.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">কোনো নগদ অ্যাকাউন্ট যোগ করা হয়নি।</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {form.nagadAccounts.map(account => (
                  <div
                    key={account.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      account.isActive
                        ? 'border-orange-200 bg-orange-50/20'
                        : 'border-slate-200 bg-slate-50 opacity-70'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {account.accountNumber}
                        </span>
                        <div className="flex items-center gap-1">
                          {account.isDefault && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              DEFAULT
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                              account.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {account.isActive ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-orange-700 bg-orange-100/60 px-2 py-0.5 rounded">
                          {account.accountType}
                        </span>
                        <span className="text-slate-600 truncate">{account.label}</span>
                      </div>

                      {account.instructions && (
                        <p className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-100 mt-1">
                          {account.instructions}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleMobileActive('Nagad', account.id)}
                          className={`font-semibold cursor-pointer ${
                            account.isActive ? 'text-amber-700 hover:underline' : 'text-emerald-700 hover:underline'
                          }`}
                        >
                          {account.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                        </button>
                        {!account.isDefault && (
                          <>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={() => handleSetDefaultMobile('Nagad', account.id)}
                              className="text-blue-900 font-semibold hover:underline cursor-pointer"
                            >
                              ডিফল্ট করুন
                            </button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditMobile(account)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMobile('Nagad', account.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rocket & Upay Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rocket */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center font-bold text-purple-700 text-xs font-mono">
                    RK
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">রকেট (Rocket)</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openAddMobile('Rocket')}
                  className="text-xs py-1"
                >
                  + Add Rocket
                </Button>
              </div>

              {form.rocketAccounts.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">কোনো রকেট অ্যাকাউন্ট নেই</p>
              ) : (
                <div className="space-y-2.5">
                  {form.rocketAccounts.map(account => (
                    <div
                      key={account.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        account.isActive ? 'border-purple-200 bg-purple-50/20' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{account.accountNumber}</span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                            {account.accountType}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px] mt-0.5 block">{account.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleMobileActive('Rocket', account.id)}
                          className={`text-[11px] font-semibold ${account.isActive ? 'text-amber-700' : 'text-emerald-700'}`}
                        >
                          {account.isActive ? 'Off' : 'On'}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditMobile(account)}
                          className="p-1 text-slate-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMobile('Rocket', account.id)}
                          className="p-1 text-rose-600 hover:text-rose-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upay */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-xs font-mono">
                    UP
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">উপায় (Upay)</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openAddMobile('Upay')}
                  className="text-xs py-1"
                >
                  + Add Upay
                </Button>
              </div>

              {form.upayAccounts.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">কোনো উপায় অ্যাকাউন্ট নেই</p>
              ) : (
                <div className="space-y-2.5">
                  {form.upayAccounts.map(account => (
                    <div
                      key={account.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        account.isActive ? 'border-teal-200 bg-teal-50/20' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{account.accountNumber}</span>
                          <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-bold">
                            {account.accountType}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px] mt-0.5 block">{account.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleMobileActive('Upay', account.id)}
                          className={`text-[11px] font-semibold ${account.isActive ? 'text-amber-700' : 'text-emerald-700'}`}
                        >
                          {account.isActive ? 'Off' : 'On'}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditMobile(account)}
                          className="p-1 text-slate-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMobile('Upay', account.id)}
                          className="p-1 text-rose-600 hover:text-rose-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bank Accounts Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-900">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">ব্যাংক অ্যাকাউন্টসমূহ (Bank Accounts)</h3>
                  <span className="text-[11px] text-slate-400">অনলাইন ফান্ড ট্রান্সফার ও সরাসরি ব্যাংক ডিপোজিট</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={openAddBank}
                className="gap-1.5 border-blue-300 text-blue-900 hover:bg-blue-50 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন ব্যাংক অ্যাকাউন্ট যোগ করুন</span>
              </Button>
            </div>

            {form.bankAccounts.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">কোনো ব্যাংক অ্যাকাউন্ট যোগ করা হয়নি।</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {form.bankAccounts.map(account => (
                  <div
                    key={account.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                      account.isActive
                        ? 'border-blue-200 bg-blue-50/15'
                        : 'border-slate-200 bg-slate-50 opacity-70'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{account.bankName}</h4>
                          <span className="text-xs text-slate-500">{account.branch}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {account.isDefault && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-mono">
                              DEFAULT
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                              account.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {account.isActive ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Account Name:</span>
                          <span className="font-bold text-slate-800">{account.accountName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Account No:</span>
                          <span className="font-mono font-bold text-blue-950">{account.accountNumber}</span>
                        </div>
                        {account.routingNumber && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Routing No:</span>
                            <span className="font-mono text-slate-700">{account.routingNumber}</span>
                          </div>
                        )}
                      </div>

                      {account.instructions && (
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {account.instructions}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleBankActive(account.id)}
                          className={`font-semibold cursor-pointer ${
                            account.isActive ? 'text-amber-700 hover:underline' : 'text-emerald-700 hover:underline'
                          }`}
                        >
                          {account.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                        </button>
                        {!account.isDefault && (
                          <>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={() => handleSetDefaultBank(account.id)}
                              className="text-blue-900 font-semibold hover:underline cursor-pointer"
                            >
                              ডিফল্ট করুন
                            </button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditBank(account)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBank(account.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: CONTACT INFORMATION                                       */}
      {/* ============================================================== */}
      {activeTab === 'contact' && (
        <div className="space-y-8">
          {/* Phone Numbers Multi-entry */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-amber-700">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">ফোন নম্বরসমূহ (Phone Numbers)</h3>
                  <span className="text-[11px] text-slate-400">হটলাইন ও সরাসরি হেল্পলাইন নম্বর</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={openAddPhone}
                className="gap-1.5 border-amber-300 text-amber-900 hover:bg-amber-50 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন ফোন নম্বর যোগ করুন</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {form.phoneNumbers.map(p => (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                    p.isActive ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 bg-slate-50 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-slate-900">{p.number}</span>
                      <div className="flex items-center gap-1">
                        {p.isDefault && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded font-mono">
                            MAIN
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {p.isActive ? 'ACTIVE' : 'OFF'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">{p.label}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePhoneActive(p.id)}
                        className={`font-semibold ${p.isActive ? 'text-amber-700' : 'text-emerald-700'}`}
                      >
                        {p.isActive ? 'অফ করুন' : 'অন করুন'}
                      </button>
                      {!p.isDefault && (
                        <>
                          <span>·</span>
                          <button
                            type="button"
                            onClick={() => handleSetDefaultPhone(p.id)}
                            className="text-blue-900 font-semibold"
                          >
                            ডিফল্ট
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditPhone(p)}
                        className="p-1 text-slate-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePhone(p.id)}
                        className="p-1 text-rose-600 hover:text-rose-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Addresses Multi-entry */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-900">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">ইমেইল এড্রেসসমূহ (Email Addresses)</h3>
                  <span className="text-[11px] text-slate-400">সাপোর্ট ও অফিসিয়াল যোগাযোগ ইমেইল</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={openAddEmail}
                className="gap-1.5 border-blue-300 text-blue-900 hover:bg-blue-50 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন ইমেইল যোগ করুন</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {form.emailAddresses.map(em => (
                <div
                  key={em.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                    em.isActive ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 bg-slate-50 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900 truncate max-w-[70%]">
                        {em.email}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {em.isDefault && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded font-mono">
                            MAIN
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            em.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {em.isActive ? 'ACTIVE' : 'OFF'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">{em.label}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleEmailActive(em.id)}
                        className={`font-semibold ${em.isActive ? 'text-amber-700' : 'text-emerald-700'}`}
                      >
                        {em.isActive ? 'অফ করুন' : 'অন করুন'}
                      </button>
                      {!em.isDefault && (
                        <>
                          <span>·</span>
                          <button
                            type="button"
                            onClick={() => handleSetDefaultEmail(em.id)}
                            className="text-blue-900 font-semibold"
                          >
                            ডিফল্ট
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditEmail(em)}
                        className="p-1 text-slate-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEmail(em.id)}
                        className="p-1 text-rose-600 hover:text-rose-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Addresses Multi-entry */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-emerald-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">ব্যবসার ঠিকানাসমূহ (Business Addresses)</h3>
                  <span className="text-[11px] text-slate-400">হেড অফিস, ব্রাঞ্চ আউটলেট ও ওয়্যারহাউস ঠিকানা</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={openAddAddress}
                className="gap-1.5 border-emerald-300 text-emerald-900 hover:bg-emerald-50 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন ঠিকানা যোগ করুন</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {form.businessAddresses.map(a => (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
                    a.isActive ? 'border-emerald-200 bg-emerald-50/15' : 'border-slate-200 bg-slate-50 opacity-70'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">{a.title}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        {a.isDefault && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded font-mono">
                            MAIN
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                            a.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {a.isActive ? 'ACTIVE' : 'OFF'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{a.address}</p>
                    {a.city && <span className="text-[11px] text-slate-400 font-medium block">{a.city}</span>}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAddressActive(a.id)}
                        className={`font-semibold ${a.isActive ? 'text-amber-700' : 'text-emerald-700'}`}
                      >
                        {a.isActive ? 'অফ করুন' : 'অন করুন'}
                      </button>
                      {!a.isDefault && (
                        <>
                          <span>·</span>
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(a.id)}
                            className="text-blue-900 font-semibold"
                          >
                            ডিফল্ট
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditAddress(a)}
                        className="p-1 text-slate-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(a.id)}
                        className="p-1 text-rose-600 hover:text-rose-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: STORE IDENTITY & POLICIES                                 */}
      {/* ============================================================== */}
      {activeTab === 'identity' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-blue-900" />
            <span>স্টোরের নাম ও ব্র্যান্ড পরিচিতি</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="স্টোরের ইংরেজি নাম (Store Name)*"
              value={form.storeName}
              onChange={e => setForm({ ...form, storeName: e.target.value })}
              required
            />
            <Input
              label="স্টোরের বাংলা নাম (Bangla Store Name)*"
              value={form.banglaStoreName}
              onChange={e => setForm({ ...form, banglaStoreName: e.target.value })}
              required
            />
          </div>

          <Input
            label="ট্যাগলাইন (Tagline)*"
            value={form.tagline}
            onChange={e => setForm({ ...form, tagline: e.target.value })}
            required
          />

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider text-slate-400">
              পলিসি ও লিগ্যাল ডকুমেন্টস
            </h4>

            <Textarea
              label="আমাদের সম্পর্কে (About Us Text)*"
              value={form.aboutUsText}
              onChange={e => setForm({ ...form, aboutUsText: e.target.value })}
              rows={4}
              required
            />

            <Textarea
              label="গোপনীয়তা নীতি (Privacy Policy Text)*"
              value={form.privacyPolicyText}
              onChange={e => setForm({ ...form, privacyPolicyText: e.target.value })}
              rows={3}
              required
            />

            <Textarea
              label="শর্তাবলী (Terms & Conditions)*"
              value={form.termsConditionsText}
              onChange={e => setForm({ ...form, termsConditionsText: e.target.value })}
              rows={3}
              required
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: GENERAL SHIPPING & SOCIAL LINKS                           */}
      {/* ============================================================== */}
      {activeTab === 'shipping' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="w-4 h-4 text-blue-900" />
              <span>সাধারণ ডেলিভারি চার্জ থ্রেশহোল্ড</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="সারাদেশে সাধারণ চার্জ (Default Fallback BDT ৳)*"
                type="number"
                value={form.defaultDeliveryCharge}
                onChange={e => setForm({ ...form, defaultDeliveryCharge: parseFloat(e.target.value) || 0 })}
                required
              />
              <Input
                label="ফ্রি ডেলিভারির ন্যূনতম অর্ডার ভ্যালু (Free Delivery Threshold BDT ৳)"
                type="number"
                value={form.freeDeliveryThreshold}
                onChange={e => setForm({ ...form, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Globe className="w-4 h-4 text-blue-900" />
              <span>সোশ্যাল মিডিয়া পেজ লিঙ্কস</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Facebook Page URL"
                value={form.facebook}
                onChange={e => setForm({ ...form, facebook: e.target.value })}
              />
              <Input
                label="Instagram URL"
                value={form.instagram}
                onChange={e => setForm({ ...form, instagram: e.target.value })}
              />
              <Input
                label="TikTok URL"
                value={form.tiktok}
                onChange={e => setForm({ ...form, tiktok: e.target.value })}
              />
              <Input
                label="YouTube Channel URL"
                value={form.youtube}
                onChange={e => setForm({ ...form, youtube: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: TELEGRAM 2-BOT ROTATION INTEGRATION                        */}
      {/* ============================================================== */}
      {activeTab === 'telegram' && (
        <div className="pt-2">
          <AdminTelegramPage />
        </div>
      )}

      {/* Floating Bottom Bar for Quick Save */}
      <div className="sticky bottom-4 z-30 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-slate-800">
        <div className="text-xs">
          <span className="font-bold block text-amber-400">রিয়েল-টাইম ডাটাবেজ সিঙ্ক</span>
          <span className="text-slate-300 text-[11px]">সংরক্ষণ করলে ওয়েবসাইট ও চেকআউট পেজে সাথে সাথে আপডেট হবে</span>
        </div>
        <Button
          onClick={() => handleSaveAll()}
          variant="gold"
          size="md"
          className="gap-2 font-bold cursor-pointer shadow"
        >
          <Save className="w-4 h-4" />
          <span>সংরক্ষণ করুন (Save)</span>
        </Button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DELIVERY AREA MODAL (Add / Edit)                              */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={deliveryModalOpen}
        onClose={() => setDeliveryModalOpen(false)}
        title={editingDeliveryRule ? 'ডেলিভারি এরিয়া ও চার্জ সম্পাদনা' : 'নতুন ডেলিভারি এরিয়া ও চার্জ যোগ করুন'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveDeliveryRule} className="space-y-4 text-left">
          {/* Division & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">বিভাগ (Division)*</label>
              <select
                value={deliveryForm.division}
                onChange={e => {
                  const div = e.target.value;
                  const divObj = BANGLADESH_DIVISIONS.find(d => d.name === div);
                  const firstDist = divObj ? divObj.districts[0]?.name || 'All' : 'All';
                  setDeliveryForm({
                    ...deliveryForm,
                    division: div,
                    district: firstDist,
                    area: ''
                  });
                }}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
              >
                <option value="All">All / সকল বিভাগ (সারাদেশ)</option>
                {BANGLADESH_DIVISIONS.map(d => (
                  <option key={d.name} value={d.name}>
                    {d.banglaName} ({d.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">জেলা (District)*</label>
              <select
                value={deliveryForm.district}
                onChange={e => {
                  const dist = e.target.value;
                  setDeliveryForm({
                    ...deliveryForm,
                    district: dist,
                    area: '',
                    name: deliveryForm.name ? deliveryForm.name : `${dist} জেলা`
                  });
                }}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
              >
                <option value="All">All / অন্যান্য সকল জেলা</option>
                {availableDistricts.map(d => (
                  <option key={d.name} value={d.name}>
                    {d.banglaName} ({d.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Area / Upazila */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">উপজেলা / এলাকা (Optional Area / Upazila)</label>
            {availableUpazilas.length > 0 ? (
              <div className="space-y-2">
                <select
                  value={deliveryForm.area}
                  onChange={e => {
                    const chosenArea = e.target.value;
                    const autoName = chosenArea && chosenArea !== 'All'
                      ? `${chosenArea} (${deliveryForm.district})`
                      : (deliveryForm.district !== 'All' ? `${deliveryForm.district} জেলা` : 'সারাদেশ / All Districts');
                    setDeliveryForm(prev => ({
                      ...prev,
                      area: chosenArea,
                      name: prev.name && prev.name !== `${prev.area} (${prev.district})` && prev.name !== `${prev.district} জেলা` ? prev.name : autoName
                    }));
                  }}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                >
                  <option value="">সম্পূর্ণ জেলা (All Upazilas in this District)</option>
                  {availableUpazilas.map(up => (
                    <option key={up} value={up}>
                      {up}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="অথবা কাস্টম এলাকার নাম টাইপ করুন (যেমন: সন্দ্বীপ, মিরপুর ইত্যাদি)"
                  value={deliveryForm.area}
                  onChange={e => setDeliveryForm({ ...deliveryForm, area: e.target.value })}
                />
              </div>
            ) : (
              <Input
                placeholder="যেমন: সন্দ্বীপ, সদর, বা যেকোনো নির্দিষ্ট এলাকা (ঐচ্ছিক)"
                value={deliveryForm.area}
                onChange={e => setDeliveryForm({ ...deliveryForm, area: e.target.value })}
              />
            )}
          </div>

          {/* Rule Title */}
          <Input
            label="ডেলিভারি এরিয়ার নাম / শিরোনাম (Display Name)*"
            placeholder="যেমন: সন্দ্বীপ উপজেলা (Sandwip Upazila) বা চট্টগ্রাম জেলা"
            value={deliveryForm.name}
            onChange={e => setDeliveryForm({ ...deliveryForm, name: e.target.value })}
            required
          />

          {/* Free Delivery ON/OFF & Delivery Charge */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">ফ্রি ডেলিভারি অন/অফ (Free Delivery)</span>
                <span className="text-[11px] text-slate-500">অন করলে এই এলাকার জন্য ডেলিভারি চার্জ স্বয়ংক্রিয়ভাবে ৳০ হবে</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliveryForm.isFreeDelivery}
                  onChange={e => {
                    const checked = e.target.checked;
                    setDeliveryForm({
                      ...deliveryForm,
                      isFreeDelivery: checked,
                      deliveryCharge: checked ? 0 : (deliveryForm.deliveryCharge === 0 ? 130 : deliveryForm.deliveryCharge)
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {!deliveryForm.isFreeDelivery ? (
              <Input
                label="ডেলিভারি চার্জ (Delivery Charge in BDT ৳)*"
                type="number"
                placeholder="যেমন: 130, 100, 80"
                value={deliveryForm.deliveryCharge}
                onChange={e => setDeliveryForm({ ...deliveryForm, deliveryCharge: parseFloat(e.target.value) || 0 })}
                required
              />
            ) : (
              <div className="p-2.5 bg-emerald-100/60 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>ফ্রি ডেলিভারি সক্রিয়! এই এলাকার গ্রাহকদের ডেলিভারি চার্জ হবে ৳০ (FREE)</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="শর্তযুক্ত ফ্রি ডেলিভারির জন্য ন্যূনতম অর্ডার (ঐচ্ছিক)"
              type="number"
              placeholder="যেমন: 1500 (০ হলে যেকোনো অর্ডারে প্রযোজ্য)"
              value={deliveryForm.minOrderAmount || ''}
              onChange={e => setDeliveryForm({ ...deliveryForm, minOrderAmount: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="আনুমানিক ডেলিভারির সময় (Estimated Days)"
              placeholder="যেমন: ১-২ কার্যদিবস বা ২-৩ কার্যদিবস"
              value={deliveryForm.estimatedDays}
              onChange={e => setDeliveryForm({ ...deliveryForm, estimatedDays: e.target.value })}
            />
          </div>

          <Input
            label="অতিরিক্ত নোট বা নির্দেশনা (Optional Notes)"
            placeholder="যেমন: সন্দ্বীপ লোকাল হোম ডেলিভারি বা কুরিয়ার ব্রাঞ্চ পিকআপ"
            value={deliveryForm.notes}
            onChange={e => setDeliveryForm({ ...deliveryForm, notes: e.target.value })}
          />

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={deliveryForm.isActive}
                onChange={e => setDeliveryForm({ ...deliveryForm, isActive: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>সক্রিয় (Active) রাখুন - গ্রাহক চেকআউটে তাৎক্ষণিক দেখতে পাবে</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={deliveryForm.isDefault}
                onChange={e => setDeliveryForm({ ...deliveryForm, isDefault: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>অন্যান্য অনির্দিষ্ট সকল জেলার জন্য ডিফল্ট রুল হিসেবে সেট করুন</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setDeliveryModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* PHONE MODAL                                                  */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        title={editingPhone ? 'ফোন নম্বর সম্পাদনা করুন' : 'নতুন ফোন নম্বর যোগ করুন'}
      >
        <form onSubmit={handleSavePhone} className="space-y-4 text-left">
          <Input
            label="ফোন নম্বর (Phone Number)*"
            placeholder="যেমন: +880 1867-841638"
            value={phoneForm.number}
            onChange={e => setPhoneForm({ ...phoneForm, number: e.target.value })}
            required
          />

          <Input
            label="বিবরণ / উদ্দেশ্য (Label / Purpose)"
            placeholder="যেমন: হটলাইন, কাস্টমার সার্ভিস, হোয়াটসঅ্যপ"
            value={phoneForm.label}
            onChange={e => setPhoneForm({ ...phoneForm, label: e.target.value })}
          />

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={phoneForm.isActive}
                onChange={e => setPhoneForm({ ...phoneForm, isActive: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>সক্রিয় (Active) রাখুন</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={phoneForm.isDefault}
                onChange={e => setPhoneForm({ ...phoneForm, isDefault: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>প্রধান নম্বর (Set as Default) হিসেবে নির্ধারণ করুন</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setPhoneModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary" size="sm">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* EMAIL MODAL                                                  */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title={editingEmail ? 'ইমেইল সম্পাদনা করুন' : 'নতুন ইমেইল যোগ করুন'}
      >
        <form onSubmit={handleSaveEmail} className="space-y-4 text-left">
          <Input
            label="ইমেইল এড্রেস (Email Address)*"
            type="email"
            placeholder="jihanstore009@gmail.com"
            value={emailForm.email}
            onChange={e => setEmailForm({ ...emailForm, email: e.target.value })}
            required
          />

          <Input
            label="বিবরণ / উদ্দেশ্য (Label / Purpose)"
            placeholder="যেমন: গ্রাহক সেবা, অফিসিয়াল যোগাযোগ"
            value={emailForm.label}
            onChange={e => setEmailForm({ ...emailForm, label: e.target.value })}
          />

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={emailForm.isActive}
                onChange={e => setEmailForm({ ...emailForm, isActive: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>সক্রিয় (Active) রাখুন</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={emailForm.isDefault}
                onChange={e => setEmailForm({ ...emailForm, isDefault: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>প্রধান ইমেইল (Set as Default) হিসেবে নির্ধারণ করুন</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setEmailModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary" size="sm">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* ADDRESS MODAL                                                */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title={editingAddress ? 'ঠিকানা সম্পাদনা করুন' : 'নতুন ঠিকানা যোগ করুন'}
      >
        <form onSubmit={handleSaveAddress} className="space-y-4 text-left">
          <Input
            label="ঠিকানার শিরোনাম / শাখার নাম (Title)*"
            placeholder="যেমন: প্রধান কার্যালয় ও শোরুম"
            value={addressForm.title}
            onChange={e => setAddressForm({ ...addressForm, title: e.target.value })}
            required
          />

          <Textarea
            label="পূর্ণ ঠিকানা (Full Address)*"
            placeholder="যেমন: CG72+R2, Sarikait 4301..."
            value={addressForm.address}
            onChange={e => setAddressForm({ ...addressForm, address: e.target.value })}
            rows={3}
            required
          />

          <Input
            label="শহর / জেলা (City / District)"
            placeholder="যেমন: Sandwip, Chittagong, Bangladesh"
            value={addressForm.city}
            onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
          />

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={addressForm.isActive}
                onChange={e => setAddressForm({ ...addressForm, isActive: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>সক্রিয় (Active) রাখুন</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>প্রধান ঠিকানা (Set as Default) করুন</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setAddressModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary" size="sm">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE BANKING MODAL (bKash / Nagad / Rocket / Upay)         */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
        title={`${mobileProvider} অ্যাকাউন্ট ${editingMobile ? 'সম্পাদনা' : 'যোগ করুন'}`}
      >
        <form onSubmit={handleSaveMobile} className="space-y-4 text-left">
          <Input
            label={`${mobileProvider} একাউন্ট নম্বর (Account Number)*`}
            placeholder="যেমন: 01867-841638"
            value={mobileForm.accountNumber}
            onChange={e => setMobileForm({ ...mobileForm, accountNumber: e.target.value })}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">অ্যাকাউন্টের ধরন (Account Type)*</label>
            <select
              value={mobileForm.accountType}
              onChange={e => setMobileForm({ ...mobileForm, accountType: e.target.value as MobileBankingType })}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
            >
              <option value="Personal">পার্সোনাল (Personal - Send Money)</option>
              <option value="Merchant">মার্চেন্ট (Merchant - Payment)</option>
              <option value="Agent">এজেন্ট (Agent - Cash In)</option>
            </select>
          </div>

          <Input
            label="অ্যাকাউন্ট লেবেল / শিরোনাম (Account Label)"
            placeholder={`যেমন: ${mobileProvider} পার্সোনাল বা মার্চেন্ট`}
            value={mobileForm.label}
            onChange={e => setMobileForm({ ...mobileForm, label: e.target.value })}
          />

          <Textarea
            label="পেমেন্ট নির্দেশনা (Instructions for Customer)"
            placeholder="যেমন: বিকাশ অ্যাপে Send Money অপশনে যান এবং রেফারেন্সে Order ID লিখুন..."
            value={mobileForm.instructions}
            onChange={e => setMobileForm({ ...mobileForm, instructions: e.target.value })}
            rows={2}
          />

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={mobileForm.isActive}
                onChange={e => setMobileForm({ ...mobileForm, isActive: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>সক্রিয় (Active) রাখুন - গ্রাহক চেকআউটে দেখতে পাবে</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={mobileForm.isDefault}
                onChange={e => setMobileForm({ ...mobileForm, isDefault: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>ডিফল্ট অ্যাকাউন্ট হিসেবে নির্বাচন করুন</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setMobileModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary" size="sm">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* BANK ACCOUNT MODAL                                           */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={bankModalOpen}
        onClose={() => setBankModalOpen(false)}
        title={editingBank ? 'ব্যাংক অ্যাকাউন্ট সম্পাদনা' : 'নতুন ব্যাংক অ্যাকাউন্ট যোগ করুন'}
      >
        <form onSubmit={handleSaveBank} className="space-y-4 text-left">
          <Input
            label="ব্যাংকের নাম (Bank Name)*"
            placeholder="যেমন: Islami Bank Bangladesh PLC"
            value={bankForm.bankName}
            onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="অ্যাকাউন্টের নাম (Account Name)*"
              placeholder="যেমন: Jihan Store"
              value={bankForm.accountName}
              onChange={e => setBankForm({ ...bankForm, accountName: e.target.value })}
              required
            />
            <Input
              label="অ্যাকাউন্ট নম্বর (Account Number)*"
              placeholder="যেমন: 20503610200000000"
              value={bankForm.accountNumber}
              onChange={e => setBankForm({ ...bankForm, accountNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="ব্রাঞ্চ / শাখা (Branch Name)*"
              placeholder="যেমন: Sandwip Branch, Chittagong"
              value={bankForm.branch}
              onChange={e => setBankForm({ ...bankForm, branch: e.target.value })}
              required
            />
            <Input
              label="রাউটিং নম্বর (Routing Number - Optional)"
              placeholder="যেমন: 125271234"
              value={bankForm.routingNumber}
              onChange={e => setBankForm({ ...bankForm, routingNumber: e.target.value })}
            />
          </div>

          <Textarea
            label="গ্রাহকের জন্য নির্দেশনা (Instructions)"
            placeholder="যেমন: অনলাইন ফান্ড ট্রান্সফার অথবা শাখায় ডিপোজিট করে রেফারেন্স সংরক্ষণ করুন..."
            value={bankForm.instructions}
            onChange={e => setBankForm({ ...bankForm, instructions: e.target.value })}
            rows={2}
          />

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={bankForm.isActive}
                onChange={e => setBankForm({ ...bankForm, isActive: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>সক্রিয় (Active) রাখুন</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={bankForm.isDefault}
                onChange={e => setBankForm({ ...bankForm, isDefault: e.target.checked })}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-800"
              />
              <span>ডিফল্ট ব্যাংক অ্যাকাউন্ট করুন</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setBankModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary" size="sm">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
