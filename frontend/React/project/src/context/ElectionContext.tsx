import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface SeatCalculation {
  invalidVotes: number;
  validVotes: number;
  qualifiedParties: {
    partyId: number;
    votes: number;
    initialSeats: number;
    remainder: number;
    bonusSeat: number;
    remainderSeat: number;
    totalSeats: number;
  }[];
}

interface ElectionContextType {
  provinces: Province[];
  districts: District[];
  parties: Party[];
  electionResults: ElectionResult[];
  setProvinces: (provinces: Province[]) => void;
  setDistricts: (districts: District[]) => void;
  setParties: (parties: Party[]) => void;
  setElectionResults: (results: ElectionResult[]) => void;
  addProvince: (province: Province) => void;
  addDistrict: (district: District) => void;
  addParty: (party: Party) => void;
  addElectionResult: (result: ElectionResult) => void;
  updateProvince: (province: Province) => void;
  updateDistrict: (district: District) => void;
  updateParty: (party: Party) => void;
  updateElectionResult: (result: ElectionResult) => void;
  deleteProvince: (id: number) => void;
  deleteDistrict: (id: number) => void;
  deleteParty: (id: number) => void;
  deleteElectionResult: (year: number, districtId: number) => void;
  calculateSeats: (result: ElectionResult, district: District) => SeatCalculation | null;
  getNationalResults: (year: number) => {
    totalVotes: number;
    invalidVotes: number;
    validVotes: number;
    partyResults: {
      partyId: number;
      votes: number;
      seats: number;
      seatBreakdown: {
        firstRound: number;
        secondRound: number;
        bonus: number;
      };
    }[];
  };
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const ElectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [electionResults, setElectionResults] = useState<ElectionResult[]>([]);

  const addProvince = (province: Province) => {
    setProvinces(prev => [...prev, province]);
  };

  const addDistrict = (district: District) => {
    setDistricts(prev => [...prev, district]);
  };

  const addParty = (party: Party) => {
    setParties(prev => [...prev, party]);
  };

  const addElectionResult = (result: ElectionResult) => {
    setElectionResults(prev => {
      const existingIndex = prev.findIndex(r => r.year === result.year && r.districtId === result.districtId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = result;
        return updated;
      }
      return [...prev, result];
    });
  };

  const updateProvince = (province: Province) => {
    setProvinces(prev => prev.map(p => p.id === province.id ? province : p));
  };

  const updateDistrict = (district: District) => {
    setDistricts(prev => prev.map(d => d.id === district.id ? district : d));
  };

  const updateParty = (party: Party) => {
    setParties(prev => prev.map(p => p.id === party.id ? party : p));
  };

  const updateElectionResult = (result: ElectionResult) => {
    setElectionResults(prev => prev.map(r => (r.year === result.year && r.districtId === result.districtId) ? result : r));
  };

  const deleteProvince = (id: number) => {
    setProvinces(prev => prev.filter(p => p.id !== id));
  };

  const deleteDistrict = (id: number) => {
    setDistricts(prev => prev.filter(d => d.id !== id));
  };

  const deleteParty = (id: number) => {
    setParties(prev => prev.filter(p => p.id !== id));
  };

  const deleteElectionResult = (year: number, districtId: number) => {
    setElectionResults(prev => prev.filter(r => !(r.year === year && r.districtId === districtId)));
  };

  const calculateSeats = (result: ElectionResult, district: District): SeatCalculation | null => {
    const partyVoteValues = Object.values(result.partyVotes);
    const totalVotes = partyVoteValues.reduce((sum, v) => sum + v, 0);
    const invalidVotes = Math.floor(totalVotes * 0.05);
    const validVotes = totalVotes - invalidVotes;
    const threshold = validVotes * 0.05;
    const totalSeats = district.seatsAllocated;
    const quota = Math.floor(validVotes / (totalSeats - 1));

    const qualifiedParties = Object.entries(result.partyVotes)
      .map(([partyId, votes]) => ({ partyId: parseInt(partyId), votes }))
      .filter(p => p.votes >= threshold);

    if (qualifiedParties.length === 0) return null;

    qualifiedParties.sort((a, b) => b.votes - a.votes);
    const bonusParty = qualifiedParties[0];

    const firstRound = qualifiedParties.map(p => ({
      ...p,
      initialSeats: Math.floor(p.votes / quota),
      remainder: p.votes % quota
    }));

    const allocatedFirstRound = firstRound.reduce((sum, p) => sum + p.initialSeats, 0);
    const remainingSeats = (totalSeats - 1) - allocatedFirstRound;

    const sortedRemainders = [...firstRound].sort((a, b) => b.remainder - a.remainder);
    const awardedRemainderParties = sortedRemainders.slice(0, remainingSeats).map(p => p.partyId);

    return {
      invalidVotes,
      validVotes,
      qualifiedParties: firstRound.map(p => ({
        ...p,
        bonusSeat: p.partyId === bonusParty.partyId ? 1 : 0,
        remainderSeat: awardedRemainderParties.includes(p.partyId) ? 1 : 0,
        totalSeats: p.initialSeats + (p.partyId === bonusParty.partyId ? 1 : 0) + (awardedRemainderParties.includes(p.partyId) ? 1 : 0)
      }))
    };
  };

  const getNationalResults = (year: number) => {
    const yearResults = electionResults.filter(r => r.year === year);
    const totalVotes = yearResults.reduce((sum, r) => sum + r.totalVotes, 0);
    const invalidVotes = Math.floor(totalVotes * 0.05);
    const validVotes = totalVotes - invalidVotes;

    const partyResults = parties.map(party => {
      const totalPartyVotes = yearResults.reduce((sum, r) => sum + (r.partyVotes[party.id] || 0), 0);

      const totalSeats = yearResults.reduce((sum, r) => {
        const district = districts.find(d => d.id === r.districtId);
        if (!district) return sum;
        const seatData = calculateSeats(r, district);
        if (!seatData) return sum;
        const partyData = seatData.qualifiedParties.find(p => p.partyId === party.id);
        return sum + (partyData?.totalSeats || 0);
      }, 0);

      return {
        partyId: party.id,
        votes: totalPartyVotes,
        seats: totalSeats,
        seatBreakdown: {
          firstRound: 0, // Optional enhancement: Break down with full record
          secondRound: 0,
          bonus: 0
        }
      };
    });

    return {
      totalVotes,
      invalidVotes,
      validVotes,
      partyResults
    };
  };

  return (
    <ElectionContext.Provider value={{
      provinces,
      districts,
      parties,
      electionResults,
      setProvinces,
      setDistricts,
      setParties,
      setElectionResults,
      addProvince,
      addDistrict,
      addParty,
      addElectionResult,
      updateProvince,
      updateDistrict,
      updateParty,
      updateElectionResult,
      deleteProvince,
      deleteDistrict,
      deleteParty,
      deleteElectionResult,
      calculateSeats,
      getNationalResults
    }}>
      {children}
    </ElectionContext.Provider>
  );
};

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};
