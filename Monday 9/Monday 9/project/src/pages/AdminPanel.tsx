import React, { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon, CheckIcon, XIcon, Save, Loader2, AlertCircle } from 'lucide-react';
import { useElection } from '../context/ElectionContext';

interface Province {
  id: number;
  name: string;
  districtCount: number;
}

interface District {
  id: number;
  provinceId: number;
  name: string;
  seatsAllocated: number;
}

interface Party {
  id: number;
  name: string;
  color: string;
  logo?: string;
  selectedDistricts: number[];
}

interface ElectionResult {
  year: number;
  districtId: number;
  totalVotes: number;
  partyVotes: { [key: number]: number };
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'province' | 'district' | 'party' | 'results' | 'data'>('province');
  
  // Province Management State
  const [provinceCount, setProvinceCount] = useState<number>(0);
  const [editingProvince, setEditingProvince] = useState<Province | null>(null);
  const [editProvinceForm, setEditProvinceForm] = useState<Partial<Province>>({
    name: '',
    districtCount: 0
  });

  // District Management State
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [editDistrictForm, setEditDistrictForm] = useState<Partial<District>>({
    name: '',
    seatsAllocated: 0
  });

  // Party Management State
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [newParty, setNewParty] = useState<Partial<Party>>({
    name: '',
    color: '#000000',
    selectedDistricts: []
  });
  const [editPartyForm, setEditPartyForm] = useState<Partial<Party>>({
    name: '',
    color: '#000000',
    logo: '',
    selectedDistricts: []
  });

  // Results Management State
  const [electionYear, setElectionYear] = useState<number>(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ElectionResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<{
    [key: string]: 'default' | 'loading' | 'success' | 'error'
  }>({});

  const {
    provinces,
    districts,
    parties,
    electionResults,
    setProvinces,
    addProvince,
    updateProvince,
    deleteProvince,
    addDistrict,
    updateDistrict,
    deleteDistrict,
    addParty,
    updateParty,
    deleteParty,
    addElectionResult,
    updateElectionResult,
    deleteElectionResult
  } = useElection();

  // Province Management Functions
  const handleProvinceCountUpdate = () => {
    if (provinceCount < provinces.length) {
      setProvinces(provinces.slice(0, provinceCount));
    }
  };

  useEffect(() => {
  const fetchProvinces = async () => {
    const response = await fetch('http://localhost:8080/api/provinces');
    if (response.ok) {
      const data = await response.json();
      setProvinces(data);
    }
  };
  fetchProvinces();
}, []);


const handleAddProvince = async (name: string, districtCount: number) => {
  const response = await fetch('http://localhost:8080/api/provinces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, districtCount })
  });

  if (response.ok) {
    const newProvince = await response.json();
    setProvinces((prev) => [...prev, newProvince]);
  }
};


  const handleEditProvince = (province: Province) => {
    setEditingProvince(province);
    setEditProvinceForm({
      name: province.name,
      districtCount: province.districtCount
    });
  };

const handleSaveProvinceEdit = async () => {
  if (editingProvince && editProvinceForm.name && editProvinceForm.districtCount) {
    const response = await fetch(`http://localhost:8080/api/provinces/${editingProvince.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editProvinceForm)
    });

    if (response.ok) {
      const updatedProvince = await response.json();
      setProvinces((prev) => prev.map((p) => (p.id === updatedProvince.id ? updatedProvince : p)));
      setEditingProvince(null);
      setEditProvinceForm({ name: '', districtCount: 0 });
    }
  }
};


  const handleCancelEdit = () => {
    setEditingProvince(null);
    setEditProvinceForm({ name: '', districtCount: 0 });
  };

const handleDeleteProvince = async (id: number) => {
  const response = await fetch(`http://localhost:8080/api/provinces/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    setProvinces((prev) => prev.filter((province) => province.id !== id));
  }
};


  // District Management Functions
  const handleAddDistrict = (name: string, seatsAllocated: number) => {
    if (selectedProvinceId) {
      const province = provinces.find(p => p.id === selectedProvinceId);
      if (province && districts.filter(d => d.provinceId === selectedProvinceId).length < province.districtCount) {
        addDistrict({
          id: Date.now(),
          provinceId: selectedProvinceId,
          name,
          seatsAllocated
        });
      }
    }
  };

  const handleEditDistrict = (district: District) => {
    setEditingDistrict(district);
    setEditDistrictForm({
      name: district.name,
      seatsAllocated: district.seatsAllocated
    });
  };

  const handleSaveDistrictEdit = () => {
    if (editingDistrict && editDistrictForm.name && editDistrictForm.seatsAllocated) {
      updateDistrict({
        ...editingDistrict,
        name: editDistrictForm.name,
        seatsAllocated: editDistrictForm.seatsAllocated
      });
      setEditingDistrict(null);
      setEditDistrictForm({ name: '', seatsAllocated: 0 });
    }
  };

  const handleCancelDistrictEdit = () => {
    setEditingDistrict(null);
    setEditDistrictForm({ name: '', seatsAllocated: 0 });
  };

  const handleDeleteDistrict = (id: number) => {
    deleteDistrict(id);
  };

  // Party Management Functions
  const handlePartyRegistration = () => {
    if (newParty.name && newParty.color) {
      addParty({
        id: Date.now(),
        name: newParty.name!,
        color: newParty.color!,
        logo: newParty.logo,
        selectedDistricts: newParty.selectedDistricts || []
      });
      setNewParty({ name: '', color: '#000000', selectedDistricts: [] });
    }
  };

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
    setEditPartyForm({
      name: party.name,
      color: party.color,
      logo: party.logo,
      selectedDistricts: [...party.selectedDistricts]
    });
  };

  const handleSavePartyEdit = () => {
    if (editingParty && editPartyForm.name && editPartyForm.color) {
      updateParty({
        ...editingParty,
        name: editPartyForm.name,
        color: editPartyForm.color,
        logo: editPartyForm.logo,
        selectedDistricts: editPartyForm.selectedDistricts || []
      });
      setEditingParty(null);
      setEditPartyForm({
        name: '',
        color: '#000000',
        logo: '',
        selectedDistricts: []
      });
    }
  };

  const handleCancelPartyEdit = () => {
    setEditingParty(null);
    setEditPartyForm({
      name: '',
      color: '#000000',
      logo: '',
      selectedDistricts: []
    });
  };

  const handleDeleteParty = (id: number) => {
    deleteParty(id);
  };

  // Results Management Functions
  const handleYearUpdate = () => {
    if (electionYear >= 2000 && electionYear <= 2100) {
      setSelectedYear(electionYear);
    }
  };

  const handleSaveResults = async (districtId: number) => {
    if (selectedYear && selectedResult) {
      try {
        setSaveStatus(prev => ({ ...prev, [districtId]: 'loading' }));
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        addElectionResult({
          year: selectedYear,
          districtId: selectedResult.districtId,
          totalVotes: selectedResult.totalVotes,
          partyVotes: selectedResult.partyVotes
        });
        
        setSaveStatus(prev => ({ ...prev, [districtId]: 'success' }));
        
        // Reset to default state after 2 seconds
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, [districtId]: 'default' }));
        }, 2000);
        
      } catch (error) {
        setSaveStatus(prev => ({ ...prev, [districtId]: 'error' }));
        
        // Reset to default state after 3 seconds
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, [districtId]: 'default' }));
        }, 3000);
      }
    }
  };

  const handleVoteCountChange = (districtId: number, totalVotes: number) => {
    setSelectedResult({
      year: selectedYear!,
      districtId,
      totalVotes,
      partyVotes: {}
    });
  };

  const handlePartyVoteChange = (partyId: number, votes: number) => {
    if (selectedResult) {
      setSelectedResult({
        ...selectedResult,
        partyVotes: {
          ...selectedResult.partyVotes,
          [partyId]: votes
        }
      });
    }
  };

  const calculateSeats = (result: ElectionResult): any => {
    const totalVotes = result.totalVotes;
    const invalidVotes = Math.floor(totalVotes * 0.05);
    const validVotes = totalVotes - invalidVotes;
    const threshold = validVotes * 0.05;
    
    const qualifiedParties = Object.entries(result.partyVotes)
      .filter(([_, votes]) => votes >= threshold)
      .map(([partyId, votes]) => ({
        partyId: parseInt(partyId),
        votes,
      }));

    const district = districts.find(d => d.id === result.districtId);
    if (!district) return null;

    const totalSeats = district.seatsAllocated;
    const proportionalSeats = totalSeats - 1;
    const quota = Math.floor(validVotes / proportionalSeats);

    // First round allocation
    const firstRound = qualifiedParties.map(party => ({
      ...party,
      initialSeats: Math.floor(party.votes / quota),
      remainder: party.votes % quota
    }));

    // Bonus seat
    const highestVotes = Math.max(...qualifiedParties.map(p => p.votes));
    const bonusParty = qualifiedParties.find(p => p.votes === highestVotes);

    // Second round allocation
    const allocatedSeats = firstRound.reduce((sum, p) => sum + p.initialSeats, 0);
    const remainingSeats = proportionalSeats - allocatedSeats;

    const sortedByRemainder = [...firstRound]
      .sort((a, b) => b.remainder - a.remainder)
      .slice(0, remainingSeats);

    return {
      invalidVotes,
      validVotes,
      qualifiedParties: firstRound.map(party => ({
        ...party,
        bonusSeat: party.partyId === bonusParty?.partyId ? 1 : 0,
        remainderSeat: sortedByRemainder.some(p => p.partyId === party.partyId) ? 1 : 0,
        totalSeats: party.initialSeats + 
          (party.partyId === bonusParty?.partyId ? 1 : 0) +
          (sortedByRemainder.some(p => p.partyId === party.partyId) ? 1 : 0)
      }))
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {['province', 'district', 'party', 'results', 'data'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab
                    ? 'border-blue-900 text-blue-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Management
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'province' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Province Count</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="0"
                    value={provinceCount}
                    onChange={(e) => setProvinceCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="border border-gray-300 rounded-md px-3 py-2 w-32"
                  />
                  <button
                    onClick={handleProvinceCountUpdate}
                    className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                  >
                    Update Count
                  </button>
                </div>
              </div>

              {provinceCount > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">Province Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {provinces.map(province => (
                      <div key={province.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{province.name}</h3>
                            <p className="text-sm text-gray-600">Districts: {province.districtCount}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingProvince(province)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProvince(province.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {provinces.length < provinceCount && (
                      <div className="border rounded-lg p-4 border-dashed">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleAddProvince(
                              formData.get('name') as string,
                              parseInt(formData.get('districtCount') as string)
                            );
                            (e.target as HTMLFormElement).reset();
                          }}
                          className="space-y-3"
                        >
                          <input
                            name="name"
                            type="text"
                            placeholder="Province Name"
                            required
                            className="w-full border rounded-md px-3 py-2"
                          />
                          <input
                            name="districtCount"
                            type="number"
                            placeholder="Number of Districts"
                            required
                            min="1"
                            className="w-full border rounded-md px-3 py-2"
                          />
                          <button
                            type="submit"
                            className="w-full bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                          >
                            Add Province
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'district' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Province List</h2>
                <div className="flex flex-wrap gap-2">
                  {provinces.map(province => {
                    const provinceDistricts = districts.filter(d => d.provinceId === province.id);
                    const isComplete = provinceDistricts.length === province.districtCount;
                    const isSelected = selectedProvinceId === province.id;
                    
                    // Generate a unique color for each province based on its name
                    const getProvinceColor = (name: string) => {
                      const colors = {
                        'Western': 'bg-blue-100 border-blue-300',
                        'Central': 'bg-green-100 border-green-300',
                        'Southern': 'bg-yellow-100 border-yellow-300',
                        'Northern': 'bg-red-100 border-red-300',
                        'Eastern': 'bg-purple-100 border-purple-300',
                        'North Western': 'bg-pink-100 border-pink-300',
                        'North Central': 'bg-indigo-100 border-indigo-300',
                        'Uva': 'bg-orange-100 border-orange-300',
                        'Sabaragamuwa': 'bg-teal-100 border-teal-300'
                      };
                      return colors[name as keyof typeof colors] || 'bg-gray-100 border-gray-300';
                    };

                    const getSelectedColor = (name: string) => {
                      const colors = {
                        'Western': 'bg-blue-500 border-blue-600',
                        'Central': 'bg-green-500 border-green-600',
                        'Southern': 'bg-yellow-500 border-yellow-600',
                        'Northern': 'bg-red-500 border-red-600',
                        'Eastern': 'bg-purple-500 border-purple-600',
                        'North Western': 'bg-pink-500 border-pink-600',
                        'North Central': 'bg-indigo-500 border-indigo-600',
                        'Uva': 'bg-orange-500 border-orange-600',
                        'Sabaragamuwa': 'bg-teal-500 border-teal-600'
                      };
                      return colors[name as keyof typeof colors] || 'bg-gray-500 border-gray-600';
                    };

                    const getCompletedColor = (name: string) => {
                      const colors = {
                        'Western': 'bg-blue-700 border-blue-800',
                        'Central': 'bg-green-700 border-green-800',
                        'Southern': 'bg-yellow-700 border-yellow-800',
                        'Northern': 'bg-red-700 border-red-800',
                        'Eastern': 'bg-purple-700 border-purple-800',
                        'North Western': 'bg-pink-700 border-pink-800',
                        'North Central': 'bg-indigo-700 border-indigo-800',
                        'Uva': 'bg-orange-700 border-orange-800',
                        'Sabaragamuwa': 'bg-teal-700 border-teal-800'
                      };
                      return colors[name as keyof typeof colors] || 'bg-gray-700 border-gray-800';
                    };

                    return (
                      <button
                        key={province.id}
                        onClick={() => setSelectedProvinceId(province.id)}
                        className={`
                          px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                          flex items-center gap-2
                          ${isComplete 
                            ? `${getCompletedColor(province.name)} text-white`
                            : isSelected
                              ? `${getSelectedColor(province.name)} text-white`
                              : `${getProvinceColor(province.name)} text-gray-700`
                          }
                          hover:shadow-md
                        `}
                      >
                        {province.name}
                        {isComplete && (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        )}
                        <span className="text-xs opacity-75">
                          ({provinceDistricts.length}/{province.districtCount})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedProvinceId && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">District Management</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {districts
                      .filter(d => d.provinceId === selectedProvinceId)
                      .map(district => (
                        <div key={district.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{district.name}</h3>
                              <p className="text-sm text-gray-600">
                                Seats: {district.seatsAllocated}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingDistrict(district)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDistrict(district.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                    ))}

                    {districts.filter(d => d.provinceId === selectedProvinceId).length <
                      (provinces.find(p => p.id === selectedProvinceId)?.districtCount || 0) && (
                      <div className="border rounded-lg p-4 border-dashed">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleAddDistrict(
                              formData.get('name') as string,
                              parseInt(formData.get('seatsAllocated') as string)
                            );
                            (e.target as HTMLFormElement).reset();
                          }}
                          className="space-y-3"
                        >
                          <input
                            name="name"
                            type="text"
                            placeholder="District Name"
                            required
                            className="w-full border rounded-md px-3 py-2"
                          />
                          <input
                            name="seatsAllocated"
                            type="number"
                            placeholder="Allocated Seats"
                            required
                            min="1"
                            className="w-full border rounded-md px-3 py-2"
                          />
                          <button
                            type="submit"
                            className="w-full bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                          >
                            Add District
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'party' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Party Registration</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Party Name
                    </label>
                    <input
                      type="text"
                      value={newParty.name}
                      onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Enter party name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Party Color
                    </label>
                    <input
                      type="color"
                      value={newParty.color}
                      onChange={(e) => setNewParty({ ...newParty, color: e.target.value })}
                      className="h-8 w-8 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Party Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewParty({ ...newParty, logo: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Districts
                    </label>
                    <div className="space-y-4">
                      {provinces.map(province => (
                        <div key={province.id} className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">{province.name}</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {districts
                              .filter(d => d.provinceId === province.id)
                              .map(district => (
                                <label key={district.id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={newParty.selectedDistricts?.includes(district.id)}
                                    onChange={(e) => {
                                      const selected = e.target.checked;
                                      setNewParty(prev => ({
                                        ...prev,
                                        selectedDistricts: selected
                                          ? [...(prev.selectedDistricts || []), district.id]
                                          : (prev.selectedDistricts || []).filter(id => id !== district.id)
                                      }));
                                    }}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm">{district.name}</span>
                                </label>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handlePartyRegistration}
                    className="w-full bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                  >
                    Register Party
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Registered Parties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parties.map(party => (
                    <div
                      key={party.id}
                      className="border rounded-lg p-4"
                      style={{ borderLeftColor: party.color, borderLeftWidth: '4px' }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{party.name}</h3>
                          <p className="text-sm text-gray-600">
                            Districts: {party.selectedDistricts.length}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingParty(party)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteParty(party.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Election Year</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={electionYear}
                    onChange={(e) => setElectionYear(parseInt(e.target.value))}
                    className="border rounded-md px-3 py-2 w-32"
                    min={2000}
                    max={2100}
                  />
                  <button
                    onClick={handleYearUpdate}
                    className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                    disabled={!electionYear || electionYear < 2000 || electionYear > 2100}
                  >
                    Update Year
                  </button>
                </div>
              </div>

              {selectedYear && (
                <div className="space-y-6">
                  {provinces.map(province => (
                    <div key={province.id} className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4">{province.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {districts
                          .filter(d => d.provinceId === province.id)
                          .map(district => {
                            const existingResult = electionResults.find(
                              r => r.year === selectedYear && r.districtId === district.id
                            );
                            const currentResult = selectedResult?.districtId === district.id ? selectedResult : existingResult;

                            return (
                              <div key={district.id} className="border rounded-lg p-4">
                                <h4 className="font-medium mb-2">{district.name}</h4>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm text-gray-600">Total Votes</label>
                                    <input
                                      type="number"
                                      value={currentResult?.totalVotes || ''}
                                      onChange={(e) => handleVoteCountChange(district.id, parseInt(e.target.value) || 0)}
                                      className="w-full border rounded-md px-3 py-2"
                                      min="0"
                                    />
                                  </div>
                                  {currentResult?.totalVotes > 0 && (
                                    <div className="space-y-2">
                                      {parties
                                        .filter(p => p.selectedDistricts.includes(district.id))
                                        .map(party => (
                                          <div key={party.id}>
                                            <label className="block text-sm text-gray-600">
                                              {party.name}
                                            </label>
                                            <input
                                              type="number"
                                              value={currentResult.partyVotes[party.id] || ''}
                                              onChange={(e) => handlePartyVoteChange(party.id, parseInt(e.target.value) || 0)}
                                              className="w-full border rounded-md px-3 py-2"
                                              min="0"
                                              max={currentResult.totalVotes}
                                            />
                                          </div>
                                        ))}
                                      <button
                                        onClick={() => handleSaveResults(district.id)}
                                        className={`
                                          w-full px-4 py-2 rounded-md mt-4 flex items-center justify-center gap-2 transition-all duration-300
                                          ${saveStatus[district.id] === 'loading' 
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : saveStatus[district.id] === 'success'
                                            ? 'bg-green-500 hover:bg-green-600 animate-pulse'
                                            : saveStatus[district.id] === 'error'
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                          }
                                          text-white font-medium
                                        `}
                                        disabled={!currentResult || Object.keys(currentResult.partyVotes).length === 0 || saveStatus[district.id] === 'loading'}
                                      >
                                        {saveStatus[district.id] === 'loading' ? (
                                          <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                          </>
                                        ) : saveStatus[district.id] === 'success' ? (
                                          <>
                                            <CheckIcon className="w-4 h-4" />
                                            <span>Saved!</span>
                                          </>
                                        ) : saveStatus[district.id] === 'error' ? (
                                          <>
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Retry Save</span>
                                          </>
                                        ) : (
                                          <>
                                            <Save className="w-4 h-4" />
                                            <span>Save Results</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Saved Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from(new Set(electionResults.map(r => r.year))).map(year => (
                    <div key={year} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{year} Election Results</h3>
                      <p className="text-sm text-gray-600">
                        Districts with data: {electionResults.filter(r => r.year === year).length}
                      </p>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setElectionYear(year);
                            setSelectedYear(year);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              {Array.from(new Set(electionResults.map(r => r.year))).map(year => (
                <div key={year} className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">{year} Election Results</h2>
                  {provinces.map(province => (
                    <div key={province.id} className="mt-4">
                      <h3 className="text-lg font-medium mb-2">{province.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {districts
                          .filter(d => d.provinceId === province.id)
                          .map(district => {
                            const result = electionResults.find(
                              r => r.year === year && r.districtId === district.id
                            );
                            if (!result) return null;

                            const seatCalculation = calculateSeats(result);
                            
                            return (
                              <div key={district.id} className="border rounded-lg p-4">
                                <h4 className="font-medium mb-2">{district.name}</h4>
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-600">
                                    Total Votes: {result.totalVotes.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Invalid Votes: {seatCalculation.invalidVotes.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Valid Votes: {seatCalculation.validVotes.toLocaleString()}
                                  </p>
                                  
                                  <div className="mt-4">
                                    <h5 className="font-medium text-sm mb-2">Party Results</h5>
                                    {seatCalculation.qualifiedParties.map((partyResult: any) => {
                                      const party = parties.find(p => p.id === partyResult.partyId);
                                      return (
                                        <div key={partyResult.partyId} className="flex justify-between text-sm">
                                          <span>{party?.name}</span>
                                          <div className="space-x-2">
                                            <span>Votes: {party ? result.partyVotes[party.id].toLocaleString() : 0}</span>
                                            <span>Seats: {partyResult.totalSeats}</span>
                                            {partyResult.bonusSeat === 1 && (
                                              <span className="text-green-600">
                                                <CheckIcon className="h-4 w-4 inline" />
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                                
                                <div className="mt-3 flex justify-end space-x-2">
                                  <button
                                    onClick={() => {
                                      setActiveTab('results');
                                      setElectionYear(year);
                                      setSelectedYear(year);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      deleteElectionResult(year, district.id);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingProvince && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Province</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-500"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province Name
                </label>
                <input
                  type="text"
                  value={editProvinceForm.name}
                  onChange={(e) => setEditProvinceForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter province name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Districts
                </label>
                <input
                  type="number"
                  value={editProvinceForm.districtCount}
                  onChange={(e) => setEditProvinceForm(prev => ({ ...prev, districtCount: parseInt(e.target.value) || 0 }))}
                  className="w-full border rounded-md px-3 py-2"
                  min="1"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProvinceEdit}
                  className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
                  disabled={!editProvinceForm.name || !editProvinceForm.districtCount}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingDistrict && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit District</h3>
              <button
                onClick={handleCancelDistrictEdit}
                className="text-gray-400 hover:text-gray-500"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District Name
                </label>
                <input
                  type="text"
                  value={editDistrictForm.name}
                  onChange={(e) => setEditDistrictForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter district name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seats Allocated
                </label>
                <input
                  type="number"
                  value={editDistrictForm.seatsAllocated}
                  onChange={(e) => setEditDistrictForm(prev => ({ ...prev, seatsAllocated: parseInt(e.target.value) || 0 }))}
                  className="w-full border rounded-md px-3 py-2"
                  min="1"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelDistrictEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDistrictEdit}
                  className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
                  disabled={!editDistrictForm.name || !editDistrictForm.seatsAllocated}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingParty && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Party</h3>
              <button
                onClick={handleCancelPartyEdit}
                className="text-gray-400 hover:text-gray-500"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Party Name
                </label>
                <input
                  type="text"
                  value={editPartyForm.name}
                  onChange={(e) => setEditPartyForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter party name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Party Color
                </label>
                <input
                  type="color"
                  value={editPartyForm.color}
                  onChange={(e) => setEditPartyForm(prev => ({ ...prev, color: e.target.value }))}
                  className="h-8 w-8 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Party Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditPartyForm(prev => ({ ...prev, logo: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full border rounded-md px-3 py-2"
                />
                {editPartyForm.logo && (
                  <div className="mt-2">
                    <img
                      src={editPartyForm.logo}
                      alt="Party logo preview"
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Districts
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {provinces.map(province => (
                    <div key={province.id} className="border rounded-lg p-2">
                      <h4 className="font-medium text-sm mb-1">{province.name}</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {districts
                          .filter(d => d.provinceId === province.id)
                          .map(district => (
                            <label key={district.id} className="flex items-center space-x-2 text-sm">
                              <input
                                type="checkbox"
                                checked={editPartyForm.selectedDistricts?.includes(district.id)}
                                onChange={(e) => {
                                  const selected = e.target.checked;
                                  setEditPartyForm(prev => ({
                                    ...prev,
                                    selectedDistricts: selected
                                      ? [...(prev.selectedDistricts || []), district.id]
                                      : (prev.selectedDistricts || []).filter(id => id !== district.id)
                                  }));
                                }}
                                className="rounded border-gray-300"
                              />
                              <span>{district.name}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelPartyEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePartyEdit}
                  className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
                  disabled={!editPartyForm.name || !editPartyForm.color}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;