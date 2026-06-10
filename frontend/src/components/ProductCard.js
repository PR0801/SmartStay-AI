import React from 'react';
import styled from 'styled-components';
import { FaHeart, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { getAmenityList, normalizeProperty } from '../data/smartStayData';

const ProductCard = ({ product, addToCart }) => {
  const property = normalizeProperty(product);
  const amenities = getAmenityList(property.amenities).slice(0, 4);

  return (
    <Card>
      <ImageWrap>
        {property.image ? (
          <img src={property.image} alt={property.property_name} />
        ) : (
          <ImageFallback>{property.property_type}</ImageFallback>
        )}
        <TypeBadge>{property.property_type}</TypeBadge>
      </ImageWrap>

      <CardBody>
        <TitleRow>
          <h2>{property.property_name}</h2>
          {property.verified && (
            <VerifiedBadge title="Verified property">
              <FaShieldAlt />
              Verified
            </VerifiedBadge>
          )}
        </TitleRow>

        <Location>
          <FaMapMarkerAlt />
          {property.location} - {property.distance_from_college} km from college
        </Location>

        <Description>{property.description}</Description>

        <AmenityList>
          {amenities.map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
        </AmenityList>

        <FooterRow>
          <Rent>Rs {property.rent.toLocaleString('en-IN')}<small>/month</small></Rent>
          <WishlistButton type="button" onClick={() => addToCart(property)}>
            <FaHeart />
            Wishlist
          </WishlistButton>
        </FooterRow>
      </CardBody>
    </Card>
  );
};

export default ProductCard;

const Card = styled.article`
  background: #ffffff;
  border: 1px solid #dfe9e3;
  border-radius: 8px;
  box-shadow: 0 10px 22px rgba(20, 43, 34, 0.08);
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow: hidden;
`;

const ImageWrap = styled.div`
  aspect-ratio: 16 / 10;
  background: #e9f4ee;
  position: relative;

  img {
    display: block;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
`;

const ImageFallback = styled.div`
  align-items: center;
  color: #466755;
  display: flex;
  font-weight: 800;
  height: 100%;
  justify-content: center;
`;

const TypeBadge = styled.span`
  background: rgba(23, 52, 40, 0.88);
  border-radius: 999px;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  left: 0.8rem;
  padding: 0.35rem 0.65rem;
  position: absolute;
  top: 0.8rem;
`;

const CardBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
`;

const TitleRow = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;

  h2 {
    color: #173629;
    font-size: 1.15rem;
    line-height: 1.25;
    margin: 0;
  }
`;

const VerifiedBadge = styled.span`
  align-items: center;
  color: #176b48;
  display: inline-flex;
  font-size: 0.8rem;
  font-weight: 800;
  gap: 0.3rem;
  white-space: nowrap;
`;

const Location = styled.p`
  align-items: center;
  color: #48675a;
  display: flex;
  font-size: 0.9rem;
  gap: 0.4rem;
  margin: 0;
`;

const Description = styled.p`
  color: #3f5149;
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.45;
  margin: 0;
`;

const AmenityList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;

  span {
    background: #edf7f2;
    border-radius: 999px;
    color: #214434;
    font-size: 0.8rem;
    padding: 0.35rem 0.55rem;
  }
`;

const FooterRow = styled.div`
  align-items: center;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-top: auto;
`;

const Rent = styled.strong`
  color: #173629;
  font-size: 1.1rem;

  small {
    color: #5f756c;
    font-size: 0.78rem;
    font-weight: 600;
    margin-left: 0.2rem;
  }
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
  gap: 0.4rem;
  justify-content: center;
  min-height: 40px;
  padding: 0.55rem 0.75rem;

  &:hover {
    background: #0f5035;
  }
`;
