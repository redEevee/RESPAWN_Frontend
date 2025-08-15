import React, { useMemo, useState, useId } from 'react';
import styled, { css } from 'styled-components';

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'order', label: '주문/결제' },
  { key: 'shipping', label: '배송' },
  { key: 'return', label: '반품/교환/환불' },
  { key: 'as', label: 'A/S' },
  { key: 'account', label: '회원' },
  { key: 'product', label: '상품' },
  { key: 'etc', label: '기타' },
];

const FAQS = [
  {
    id: 1,
    cat: 'order',
    q: '결제내역 증빙은 어디서 발급하나요?',
    a: '마이페이지 > 주문내역에서 영수증/현금영수증/세금계산서 신청이 가능합니다.',
  },
  {
    id: 2,
    cat: 'shipping',
    q: '평균 배송 소요기간은?',
    a: '일반 1~3일, 도서산간 2~5일 소요됩니다. 기상/물류 사정에 따라 변동될 수 있습니다.',
  },
  {
    id: 3,
    cat: 'return',
    q: '퀵/프리미엄 배송 상품도 반품되나요?',
    a: '가능합니다. 단, 회수비가 추가될 수 있으며 지역에 따라 금액이 상이합니다.',
  },
  {
    id: 4,
    cat: 'as',
    q: 'A/S 접수는 어떻게 하나요?',
    a: '고객센터 1:1 문의 또는 A/S 전용 폼으로 접수해 주세요. 접수 후 알림톡이 발송됩니다.',
  },
  {
    id: 5,
    cat: 'account',
    q: '비밀번호를 잊었어요.',
    a: '로그인 > 비밀번호 찾기에서 재설정 링크를 이메일로 받아 변경할 수 있습니다.',
  },
  {
    id: 6,
    cat: 'product',
    q: '업체직배송 상품이란?',
    a: '제조사에서 직접 발송하는 상품으로 송장 갱신이 늦을 수 있습니다.',
  },
  {
    id: 7,
    cat: 'return',
    q: '교환 시 왕복배송비는 얼마인가요?',
    a: '기본 6,000원이며 상품/지역에 따라 달라질 수 있습니다.',
  },
  {
    id: 8,
    cat: 'etc',
    q: '세금계산서 발급 경로는?',
    a: '사업자회원은 마이페이지 > 증빙서류 메뉴에서 신청 가능합니다.',
  },
];

const NOTICES = [
  {
    id: 'n1',
    title: '8월 임시 휴무 및 배송 일정',
    date: '2025-08-01',
    tag: '배송',
  },
  {
    id: 'n2',
    title: '개인정보 처리방침 개정 안내',
    date: '2025-07-27',
    tag: '정책',
  },
  {
    id: 'n3',
    title: '시스템 점검 (8/21 02:00~05:00)',
    date: '2025-07-21',
    tag: '점검',
  },
];

const QUICK_LINKS = [
  { key: 'call', label: '전화상담', icon: '📞' },
  { key: 'chat', label: '채팅상담', icon: '💬' },
  { key: 'remote', label: '원격지원', icon: '🖥️' },
  { key: 'callback', label: '콜백예약', icon: '⏱️' },
];

const srOnly = css`
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export default function SupportCenter() {
  const [keyword, setKeyword] = useState('');
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('relevance'); // relevance | recent

  const onSearch = () => {
    console.log('검색:', { keyword, cat, sort });
  };

  return (
    <Page>
      <Main>
        <Header>
          <h1>도움이 필요하신가요?</h1>
          <p>검색으로 바로 해결하거나, 빠른 액션으로 상담을 요청하세요.</p>
        </Header>

        <CommandBar
          value={keyword}
          onChange={setKeyword}
          onSearch={onSearch}
          category={cat}
          onCategory={setCat}
          sort={sort}
          onSort={setSort}
          suggestions={['배송조회', '세금계산서', '반품비', 'A/S 신청']}
        />

        <NoticeCarousel items={NOTICES} />

        <TwoColumn>
          <section aria-labelledby="faq-heading">
            <SectionTitle id="faq-heading">자주 묻는 질문</SectionTitle>
            <FAQMasonry
              items={FAQS}
              category={cat}
              keyword={keyword}
              sort={sort}
              onQuick={(action, item) =>
                console.log('FAQ Action:', action, item)
              }
            />
          </section>

          <aside>
            <ActionStack
              items={QUICK_LINKS}
              onClick={(k) => console.log('Quick:', k)}
            />
            <ContactCard />
          </aside>
        </TwoColumn>
      </Main>
      <FooterNote>
        더 도움 필요하다면 고객센터 1:1 문의로 상세내용을 남겨주세요. 평일 기준
        24시간 내 응답합니다.
      </FooterNote>
    </Page>
  );
}

function CommandBar({
  value,
  onChange,
  onSearch,
  category,
  onCategory,
  sort,
  onSort,
  suggestions,
}) {
  const inputId = useId();
  return (
    <CmdWrap role="search">
      <label htmlFor={inputId} css={srOnly}>
        검색
      </label>
      <div className="row">
        <input
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예) 반품비, 세금계산서, A/S 신청"
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <Select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          aria-label="카테고리"
        >
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          aria-label="정렬"
        >
          <option value="relevance">관련도순</option>
          <option value="recent">최신순</option>
        </Select>
        <SearchBtn onClick={onSearch}>검색</SearchBtn>
      </div>
      <div className="chips">
        {suggestions.map((s) => (
          <Chip key={s} onClick={() => onChange(s)}>
            #{s}
          </Chip>
        ))}
      </div>
    </CmdWrap>
  );
}

function NoticeCarousel({ items }) {
  return (
    <NoticeWrap aria-label="공지사항 요약">
      {items.map((n) => (
        <NoticeCard key={n.id}>
          <div className="badge">{n.tag}</div>
          <div className="title">{n.title}</div>
          <div className="date">{n.date}</div>
        </NoticeCard>
      ))}
    </NoticeWrap>
  );
}

function FAQMasonry({ items, category, keyword, sort, onQuick }) {
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    let list = items.filter(
      (i) =>
        (category === 'all' || i.cat === category) &&
        (!kw ||
          i.q.toLowerCase().includes(kw) ||
          i.a.toLowerCase().includes(kw))
    );
    if (sort === 'recent') list = [...list].sort((a, b) => b.id - a.id);
    return list;
  }, [items, category, keyword, sort]);

  const left = filtered.filter((_, idx) => idx % 2 === 0);
  const right = filtered.filter((_, idx) => idx % 2 === 1);

  return (
    <Masonry>
      <div className="col">
        {left.map((f) => (
          <FAQCard key={f.id} item={f} onQuick={onQuick} />
        ))}
      </div>
      <div className="col">
        {right.map((f) => (
          <FAQCard key={f.id} item={f} onQuick={onQuick} />
        ))}
      </div>
      {filtered.length === 0 && <EmptyBox>검색 결과가 없습니다.</EmptyBox>}
    </Masonry>
  );
}

function FAQCard({ item, onQuick }) {
  const [open, setOpen] = useState(false);
  return (
    <Card $open={open}>
      <button
        className="q"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="qmark">Q</span>
        <span className="qt">{item.q}</span>
        <span className="arrow">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="a">
          <div className="amark">A</div>
          <div className="at">{item.a}</div>
          <div className="quick">
            <Quick onClick={() => onQuick('inquiry', item)}>문의하기</Quick>
            <Quick onClick={() => onQuick('return-guide', item)} $alt>
              교환/반품 가이드
            </Quick>
            <Quick onClick={() => onQuick('call', item)}>전화상담</Quick>
          </div>
        </div>
      )}
    </Card>
  );
}

function ActionStack({ items, onClick }) {
  return (
    <Stack>
      {items.map((i) => (
        <StackBtn key={i.key} onClick={() => onClick(i.key)}>
          <div className="icon">{i.icon}</div>
          <div className="label">{i.label}</div>
        </StackBtn>
      ))}
    </Stack>
  );
}

function ContactCard() {
  return (
    <Contact>
      <div className="title">대표 상담센터</div>
      <div className="num">1588-8377</div>
      <div className="time">평일 09:00~18:00 · 점심 12:00~13:00</div>
      <CallBtn>즉시 전화</CallBtn>
    </Contact>
  );
}

const Page = styled.div`
  --indigo: #4f46e5;
  --green: #22c55e;
  --amber: #f59e0b;
  --ink: #0f172a;
  --muted: #64748b;
  --line: #e2e8f0;
  background: #f8fafc;
  min-height: 100vh;
  color: var(--ink);
`;

const Main = styled.main`
  max-width: 1120px;
  padding: 28px 20px 40px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 16px;
  h1 {
    font-size: 24px;
    margin: 0 0 6px;
  }
  p {
    color: var(--muted);
    margin: 0;
  }
`;

const CmdWrap = styled.section`
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px;
  margin: 16px 0 18px;
  .row {
    display: flex;
    gap: 8px;
  }
  input {
    flex: 1;
    padding: 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
    font-size: 14px;
  }
  .chips {
    margin-top: 10px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
`;

const Select = styled.select`
  padding: 12px 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
`;

const SearchBtn = styled.button`
  background: var(--indigo);
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 0 16px;
  font-weight: 600;
  cursor: pointer;
`;

const Chip = styled.button`
  border: 1px dashed var(--line);
  background: #f1f5f9;
  color: var(--muted);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    border-style: solid;
  }
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  @media (min-width: 980px) {
    grid-template-columns: 2fr 320px;
  }
`;

const NoticeWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin: 8px 0 16px;
  @media (min-width: 720px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const NoticeCard = styled.article`
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
  .badge {
    display: inline-block;
    background: #eef2ff;
    color: var(--indigo);
    border-radius: 8px;
    font-size: 12px;
    padding: 2px 8px;
    margin-bottom: 6px;
  }
  .title {
    font-weight: 600;
  }
  .date {
    color: var(--muted);
    font-size: 12px;
    margin-top: 4px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  margin: 0 0 10px;
`;

const Masonry = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  .col {
    display: grid;
    gap: 12px;
    align-content: start;
  }
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  .q {
    width: 100%;
    text-align: left;
    display: grid;
    grid-template-columns: 24px 1fr 20px;
    gap: 8px;
    align-items: center;
    padding: 12px 14px;
    background: #fff;
    border: 0;
    cursor: pointer;
  }
  .qmark {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #eef2ff;
    color: var(--indigo);
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 700;
  }
  .qt {
    font-size: 14px;
  }
  .arrow {
    color: var(--muted);
  }
  .a {
    padding: 12px 14px;
    background: #f8fafc;
    display: grid;
    gap: 10px;
    grid-template-columns: 24px 1fr;
  }
  .amark {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--indigo);
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 700;
    margin-top: 2px;
  }
  .at {
    color: #334155;
    line-height: 1.6;
  }
  .quick {
    grid-column: 1 / -1;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
`;

const Quick = styled.button`
  border: 1px solid var(--line);
  background: #fff;
  color: #111827;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
  ${(p) =>
    p.$alt &&
    css`
      background: #ecfccb;
      border-color: #d9f99d;
    `}
  &:hover {
    border-color: #cbd5e1;
  }
`;

const Stack = styled.div`
  display: grid;
  gap: 10px;
`;

const StackBtn = styled.button`
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px;
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 10px;
  align-items: center;
  text-align: left;
  cursor: pointer;
  .icon {
    font-size: 18px;
  }
  .label {
    font-weight: 600;
  }
`;

const Contact = styled.div`
  margin-top: 12px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  .title {
    color: var(--muted);
  }
  .num {
    font-size: 22px;
    font-weight: 800;
    margin: 6px 0;
  }
  .time {
    color: var(--muted);
    font-size: 12px;
  }
`;

const CallBtn = styled.button`
  margin-top: 10px;
  width: 100%;
  background: var(--green);
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 10px;
  font-weight: 700;
  cursor: pointer;
`;

const EmptyBox = styled.div`
  grid-column: 1 / -1;
  background: #fff;
  border: 1px dashed var(--line);
  border-radius: 12px;
  padding: 18px;
  text-align: center;
  color: var(--muted);
`;

const FooterNote = styled.footer`
  max-width: 1120px;
  margin: 8px auto 28px;
  color: var(--muted);
  padding: 0 20px;
`;
