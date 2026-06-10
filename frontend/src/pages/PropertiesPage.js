import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaHeart, FaSearch } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import AIRecommendation from '../components/AIRecommendation';
import { CartContext } from '../context/CartContext';
import { baseUrl } from '../components/common/baseUrl';
import {
  budgetOptions,
  fallbackProperties,
  normalizeProperty,
  propertyTypes,
} from '../data/smartStayData';
import { useNavigate } from 'react-router-dom';

const PropertiesPage = () => {
  const [properties, setProperties] = useState(fallbackProperties);
  const [types, setTypes] = useState(propertyTypes);
  const [sortOption, setSortOption] = useState('rent-low-high');
  const [typeFilter, setTypeFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const { addToCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/properties`);
        const data = await response.json();
        const incoming = Array.isArray(data.data) ? data.data : data;

        if (Array.isArray(incoming) && incoming.length > 0) {
          setProperties(incoming.map(normalizeProperty));
        }
      } catch (error) {
        setProperties(fallbackProperties);
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/property-types`);
        const data = await response.json();
        const incoming = Array.isArray(data.data) ? data.data : data;

        if (Array.isArray(incoming) && incoming.length > 0) {
          setTypes(incoming);
        }
      } catch (error) {
        setTypes(propertyTypes);
      }
    };

    fetchProperties();
    fetchTypes();
  }, []);

  const filteredProperties = useMemo(() => {
    const selectedBudget = budgetOptions.find((option) => option.value === budgetFilter);

    return properties
      .map(normalizeProperty)
      .filter((property) => {
        const matchesType = !typeFilter || property.property_type === typeFilter;
        const matchesBudget =
          !selectedBudget ||
          (property.rent >= selectedBudget.min && property.rent <= selectedBudget.max);
        const matchesSearch =
          !searchTerm ||
          `${property.property_name} ${property.location} ${property.description} ${property.amenities}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesVerification = !verifiedOnly || property.verified;

        return matchesType && matchesBudget && matchesSearch && matchesVerification;
      })
      .sort((a, b) => {
        if (sortOption === 'rent-low-high') return a.rent - b.rent;
        if (sortOption === 'rent-high-low') return b.rent - a.rent;
        if (sortOption === 'distance-low-high') {
          return a.distance_from_college - b.distance_from_college;
        }
        if (sortOption === 'verified-first') return Number(b.verified) - Number(a.verified);
        return 0;
      });
  }, [budgetFilter, properties, searchTerm, sortOption, typeFilter, verifiedOnly]);

  return (
    <PropertiesContainer>
      <PageHeader>
        <div>
          <Eyebrow>SDG 11 - Sustainable Cities and Communities</Eyebrow>
          <h1>Student Accommodations</h1>
          <p>Find safe, affordable, and verified housing near your college.</p>
        </div>
        <WishlistButton type="button" onClick={() => navigate('/wishlist')}>
          <FaHeart />
          Wishlist ({cartItems.length})
        </WishlistButton>
      </PageHeader>

      <AIRecommendation properties={properties} onWishlist={addToCart} />

      <FilterSortContainer>
        <SearchBox>
          <FaSearch />
          <input
            type="search"
            placeholder="Search by area, amenity, or property name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </SearchBox>

        <Filter>
          <label htmlFor="typeFilter">Property Type</label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type.id || type.category_name} value={type.category_name}>
                {type.category_name}
              </option>
            ))}
          </select>
        </Filter>

        <Filter>
          <label htmlFor="budgetFilter">Budget Filter</label>
          <select
            id="budgetFilter"
            value={budgetFilter}
            onChange={(event) => setBudgetFilter(event.target.value)}
          >
            <option value="">Any Budget</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Filter>

        <Filter>
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
          >
            <option value="rent-low-high">Rent: Low to High</option>
            <option value="rent-high-low">Rent: High to Low</option>
            <option value="distance-low-high">Nearest College First</option>
            <option value="verified-first">Verified First</option>
          </select>
        </Filter>

        <ToggleLabel>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(event) => setVerifiedOnly(event.target.checked)}
          />
          Verified only
        </ToggleLabel>
      </FilterSortContainer>

      <ResultHeader>
        <h2>{filteredProperties.length} matching stays</h2>
        <p>SmartStay AI scores affordability, proximity, amenities, and verification.</p>
      </ResultHeader>

      <PropertiesGrid>
        {filteredProperties.map((property) => (
          <ProductCard key={property.id} product={property} addToCart={addToCart} />
        ))}
      </PropertiesGrid>
    </PropertiesContainer>
  );
};

export default PropertiesPage;

const PropertiesContainer = styled.div`
  background: #f4f8f5;
  color: #173629;
  min-height: 100vh;
  padding: 2rem;

  @media (max-width: 680px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.header`
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin: 0 auto 2rem;
  max-width: 1180px;

  h1 {
    font-size: 2.2rem;
    line-height: 1.1;
    margin: 0.2rem 0 0.5rem;
  }

  p {
    color: #48675a;
    font-size: 1.05rem;
    margin: 0;
  }

  @media (max-width: 680px) {
    flex-direction: column;
  }
`;

const Eyebrow = styled.p`
  color: #4f7d64;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0;
  margin: 0;
  text-transform: uppercase;
`;

const WishlistButton = styled.button`
  align-items: center;
  background: #176b48;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 0.45rem;
  min-height: 44px;
  padding: 0.7rem 1rem;
  white-space: nowrap;
`;

const FilterSortContainer = styled.section`
  align-items: end;
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(240px, 1.5fr) repeat(3, minmax(160px, 1fr)) auto;
  margin: 0 auto 1.5rem;
  max-width: 1180px;
  padding: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const SearchBox = styled.label`
  align-items: center;
  border: 1px solid #bdd6cb;
  border-radius: 6px;
  color: #4f7d64;
  display: flex;
  gap: 0.6rem;
  min-height: 44px;
  padding: 0 0.75rem;

  input {
    border: 0;
    color: #173629;
    flex: 1;
    font-size: 1rem;
    min-width: 0;
    outline: none;
  }

  @media (max-width: 980px) {
    grid-column: 1 / -1;
  }
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    color: #244337;
    font-size: 0.85rem;
    font-weight: 800;
  }

  select {
    border: 1px solid #bdd6cb;
    border-radius: 6px;
    color: #173629;
    font-size: 1rem;
    min-height: 44px;
    padding: 0.65rem;
  }
`;

const ToggleLabel = styled.label`
  align-items: center;
  color: #244337;
  display: inline-flex;
  font-weight: 800;
  gap: 0.4rem;
  min-height: 44px;
  white-space: nowrap;
`;

const ResultHeader = styled.div`
  align-items: baseline;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin: 0 auto 1rem;
  max-width: 1180px;

  h2 {
    font-size: 1.2rem;
    margin: 0;
  }

  p {
    color: #5c766b;
    margin: 0;
  }

  @media (max-width: 680px) {
    flex-direction: column;
  }
`;

const PropertiesGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  margin: 0 auto;
  max-width: 1180px;
`;
