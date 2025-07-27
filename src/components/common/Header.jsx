import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from './Logo';
import userIcon from '../../assets/user_icon.png';
import cartIcon from '../../assets/cart_icon.png';
import categoryIcon from '../../assets/category_icon.png';
import Search from './Search';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);

  const categoryGroups = [
    {
      title: '🎮 게이밍 기어',
      items: [
        '게임 컨트롤러',
        '조이스틱',
        '게임용 체어',
        '게임용 데스크',
        'VR 기기',
      ],
    },
    {
      title: '💻 컴퓨터 부품 / 주변기기',
      items: [
        '그래픽카드',
        'CPU',
        'SSD',
        '노트북 스탠드',
        '거치대',
        '웹캠',
        '마이크',
      ],
    },
    {
      title: '🔊 오디오 / 영상 장비',
      items: ['마이크', '캡쳐보드', '사운드 카드', '프로젝터'],
    },
    {
      title: '🧰 사무용 / 기타',
      items: ['프린터', '복합기', '허브', '멀티탭', '케이블', '에어 블로워'],
    },
    {
      title: '🪄 악세서리',
      items: ['마우스패드', '손목 보호대', '케이블 정리 용품'],
    },
  ];

  const menuItems = [
    '모니터',
    '헤드셋',
    '키보드',
    '마우스',
    '스피커',
    '신상품',
    '베스트셀러',
    '브랜드',
    '이벤트',
  ];

  const userData = JSON.parse(localStorage.getItem('userData'));
  const name = userData?.name;
  const role = userData?.authorities;
  console.log(userData);

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      localStorage.removeItem('userData');
      alert('로그아웃 완료');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  return (
    <HeaderContainer>
      <TopBar>
        <TopMenu>
          {name ? (
            <>
              <span>{name}님</span>
              <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                로그아웃
              </span>
            </>
          ) : (
            <a href="/login" style={{ textDecoration: 'none', color: '#666' }}>
              <span>로그인</span>
            </a>
          )}
          <a href="/mypage">
            <UserIcon src={userIcon} alt="User Icon" />
          </a>

          {role === '[ROLE_USER]' && (
            <a href="/cart">
              <CartIcon src={cartIcon} alt="Cart Icon" />
            </a>
          )}

          {role === '[ROLE_SELLER]' && (
            <a
              href="/seller-center"
              style={{ textDecoration: 'none', color: '#666' }}
            >
              <span>판매자센터</span>
            </a>
          )}
          <span>고객센터</span>
        </TopMenu>
      </TopBar>

      <MainBar>
        <Logo />
        <Search />
      </MainBar>

      <CateGoryBar>
        <CateGoryMenu>
          <Category>
            <UserIcon src={categoryIcon} onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
              <DropdownWrapper>
                <CategoryList>
                  {categoryGroups.map((group, idx) => (
                    <CategoryItem
                      key={idx}
                      onMouseEnter={() => setActiveGroup(idx)}
                      isActive={activeGroup === idx}
                    >
                      {group.title}
                    </CategoryItem>
                  ))}
                </CategoryList>

                <SubCategoryList>
                  <SubTitle>{categoryGroups[activeGroup].title}</SubTitle>
                  <ul>
                    {categoryGroups[activeGroup].items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </SubCategoryList>
              </DropdownWrapper>
            )}
          </Category>
          <Menu>
            <ul>
              {menuItems.map((item, idx) =>
                typeof item === 'string' ? (
                  <li key={idx}>{item}</li>
                ) : (
                  <MenuItem key={idx}>{item.name}</MenuItem>
                )
              )}
            </ul>
          </Menu>
        </CateGoryMenu>
      </CateGoryBar>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  width: 100%;
  border-bottom: 1px solid #eee;
`;

const TopBar = styled.div`
  padding: 8px 20px;
  border-bottom: 1px solid #ddd;
`;

const TopMenu = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  font-size: 13px;
  color: #666;
`;

const UserIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const CartIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const MainBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  transform: translateX(-5%);
`;

const CateGoryBar = styled.div`
  position: relative;
  padding: 8px 20px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
`;

const CateGoryMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-size: 13px;
  color: #666;
`;

const Category = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 15px;
  font-weight: 500;
  color: #444;

  ul {
    display: flex;
    gap: 24px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    position: relative;
    cursor: pointer;
    transition: color 0.3s ease;
    padding: 6px 0;

    &:hover {
      color: rgb(85, 90, 130);
    }
  }
`;

const MenuItem = styled.li`
  &:hover > ul {
    display: block;
  }
`;

const DropdownWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 100%;
  left: 0;
  width: 600px;
  height: 300px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
`;

const CategoryList = styled.div`
  width: 200px;
  border-right: 1px solid #eee;
  background: rgba(85, 90, 130, 0.1);
  padding: 12px 0;
`;

const CategoryItem = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  background: ${({ isActive }) => (isActive ? '#fff' : 'transparent')};
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: ${({ isActive }) => (isActive ? 'rgb(85, 90, 130)' : '#666')};
  transition: color 0.2s;

  &:hover {
    background: #fff;
    color: rgb(85, 90, 130);
  }
`;

const SubCategoryList = styled.div`
  flex: 1;
  padding: 24px 30px; /* 패딩 좀 크게 */
  font-size: 14px;
  color: #444;
  background: #fff;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
    cursor: pointer;
    transition: color 0.2s;
    color: #444; /* 기본 글자색 */

    &:hover {
      color: rgb(85, 90, 130);
      background: #fff;
    }
  }
`;

const SubTitle = styled.div`
  font-weight: 700;
  margin-bottom: 20px;
  font-size: 16px;
  color: #222;
`;
