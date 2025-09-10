import styled from 'styled-components';

const StarRating = ({
  value = 0,
  max = 5,
  size = 18,
  colorFilled = '#ffc107',
  colorEmpty = '#ddd',
  readOnly = true,
  className,
  'aria-label': ariaLabel,
}) => {
  const label = ariaLabel ?? `평점 ${value} / ${max}`;
  return (
    <Stars role="img" aria-label={label} className={className} $size={size}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < value ? colorFilled : colorEmpty }}>
          ★
        </span>
      ))}
    </Stars>
  );
};

const Stars = styled.div`
  font-size: ${({ $size }) => $size}px;
  line-height: 1;
  color: inherit;
`;

export default StarRating;
