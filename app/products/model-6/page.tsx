'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MODEL_6_PRICE = 2180000;
const MODEL_7_PRICE = 1380000;

const BANK_NAME = '국민은행';
const BANK_ACCOUNT = '891237-00-004097';
const ACCOUNT_HOLDER = '엑스아톰 (XATOM)';
const CONTACT_TO = 'xatom.space@gmail.com';

const initialBankOrderForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  addressDetail: '',
  depositorName: '',
  memo: '',
};

const imageItems = [
  {
    desktopSrc: '/p15-model6-desktop.jpg?v=20260616',
    mobileSrc: '/p15-model6-mobile.jpg?v=20260616',
    alt: 'model 6 detail 1',
  },
  {
    desktopSrc: '/p16-model6-desktop.jpg?v=20260616',
    mobileSrc: '/p16-model6-mobile.jpg?v=20260616',
    alt: 'model 6 detail 2',
  },
] as const;

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.25" y="2.25" width="19.5" height="19.5" rx="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function CompleteCheckIcon() {
  return (
    <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#4eea18] md:h-24 md:w-24">
      <svg className="h-9 w-10 md:h-14 md:w-14" viewBox="0 0 64 54" fill="none" aria-hidden="true">
        <path
          d="M8 28 L23 43 L56 12"
          stroke="#050505"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function formatKRW(n: number) {
  return new Intl.NumberFormat('ko-KR').format(n);
}

function GalleryImage({
  desktopSrc,
  mobileSrc,
  alt,
  eager = false,
}: {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  eager?: boolean;
}) {
  return (
    <div className="w-full overflow-hidden bg-white">
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileSrc} />
        <img
          src={desktopSrc}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          className="block h-auto w-full"
        />
      </picture>
    </div>
  );
}

export default function Model6ProductPage() {
  const [model6Qty, setModel6Qty] = useState(1);
  const [model7Selected, setModel7Selected] = useState(false);
  const [model6Color, setModel6Color] = useState('');
  const [model7Color, setModel7Color] = useState('');
  const [bankOrderOpen, setBankOrderOpen] = useState(false);
  const [bankOrderForm, setBankOrderForm] = useState(initialBankOrderForm);
  const [bankOrderStatus, setBankOrderStatus] = useState('');
  const [bankOrderSubmitting, setBankOrderSubmitting] = useState(false);
  const [bankOrderComplete, setBankOrderComplete] = useState(false);

  const total = useMemo(() => {
    const model6Total = MODEL_6_PRICE * model6Qty;
    const model7Total = model7Selected ? MODEL_7_PRICE : 0;
    return model6Total + model7Total;
  }, [model6Qty, model7Selected]);

  const decModel6Qty = () => setModel6Qty((v) => Math.max(1, v - 1));
  const incModel6Qty = () => setModel6Qty((v) => Math.min(99, v + 1));

  const updateBankOrderForm = (
    field: keyof typeof initialBankOrderForm,
    value: string
  ) => {
    setBankOrderForm((current) => ({ ...current, [field]: value }));
  };

  const handleBankOrderSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBankOrderStatus('');
    setBankOrderComplete(false);
    setBankOrderSubmitting(true);

    try {
      const res = await fetch('/api/bank-transfer-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bankOrderForm,
          productName: 'model 6',
          model6Qty,
          model7Selected,
          model6Color,
          model7Color: model7Selected ? model7Color : '',
          totalAmount: total,
          bankName: BANK_NAME,
          bankAccount: BANK_ACCOUNT,
          accountHolder: ACCOUNT_HOLDER,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit order.');
      }

      setBankOrderStatus('주문 정보가 접수되었습니다. 입금 확인 후 안내드리겠습니다.');
      setBankOrderComplete(true);
      setBankOrderForm(initialBankOrderForm);
      setModel6Color('');
      setModel7Color('');
    } catch (error) {
      setBankOrderStatus(
        error instanceof Error
          ? error.message
          : '주문 접수에 실패했습니다. 이메일로 문의해 주세요.'
      );
    } finally {
      setBankOrderSubmitting(false);
    }
  };

  return (
    <main className="bg-white text-black">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur">
        <nav className="section-shell flex min-h-[92px] items-center justify-between py-4 md:h-50 md:py-0">
          <Link href="/" aria-label="Go to intro" className="flex shrink-0 items-center">
            <Image
              src="/xatom-v1.png"
              alt="xatom logo"
              width={160}
              height={60}
              priority
              className="h-auto w-[118px] md:w-[160px]"
            />
          </Link>

          <div className="grid grid-cols-[auto_auto_auto_auto] grid-rows-2 items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.18em] md:flex md:gap-8 md:text-xs md:tracking-[0.22em]">
            <Link href="/home#hero">Home</Link>
            <Link href="/home#about">About</Link>
            <Link href="/home#ip">IP</Link>
            <a
              href="https://instagram.com/xatom.space"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center"
            >
              <InstagramIcon />
            </a>
            <Link href="/home#shop" className="col-start-1 row-start-2">Shop</Link>
            <Link href="/home#contact" className="col-start-2 row-start-2">Contact</Link>
          </div>
        </nav>
      </header>

      <section className="py-12 md:section-shell md:py-24">
        <div className="section-shell">
          <p className="text-[10px] uppercase tracking-[0.35em] text-black/60">Product</p>

          <div className="mt-8 grid gap-12 md:grid-cols-2 md:items-start">
            <div className="mx-auto w-full max-w-[620px] md:max-w-none">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/[0.03]">
                <Image
                  src="/p14.jpg"
                  alt="model 6"
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">
                model 6
              </h1>
              <p className="mt-6 text-sm text-black/70">
                A sculptural armchair for spatial density.
              </p>

              <div className="mt-10 space-y-8 text-sm">
                <div className="border-t border-black/10 pt-6">
                  <p className="mb-3 text-black/60">· model 6</p>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={decModel6Qty} className="border border-black/20 px-3 py-1">
                      -
                    </button>
                    <span className="min-w-[24px] text-center">{model6Qty}</span>
                    <button type="button" onClick={incModel6Qty} className="border border-black/20 px-3 py-1">
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-black/10 pt-6">
                  <p className="mb-3 text-black/60">· model 7</p>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={model7Selected}
                      onChange={(e) => setModel7Selected(e.target.checked)}
                    />
                    <span>선택</span>
                  </label>
                  <p className="mt-3 text-sm text-black/60">+ ₩ {formatKRW(MODEL_7_PRICE)}</p>
                </div>

                <div className="border-t border-black/10 pt-6">
                  <p className="mb-3 text-black/60">· Custom Color</p>
                  <div className="grid gap-4">
                    <label className="block text-sm">
                      <span className="text-black/60">model 6 color</span>
                      <input
                        value={model6Color}
                        onChange={(e) => setModel6Color(e.target.value)}
                        placeholder="원하는 색상을 적어주세요"
                        className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                      />
                    </label>

                    <label className={`block text-sm ${model7Selected ? '' : 'pointer-events-none opacity-40'}`}>
                      <span className="text-black/60">model 7 color</span>
                      <input
                        value={model7Color}
                        onChange={(e) => setModel7Color(e.target.value)}
                        placeholder="model 7 선택 시 입력"
                        className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t border-black/20 pt-6 text-base font-medium">
                  ₩ {formatKRW(total)}
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBankOrderOpen(true);
                      setBankOrderStatus('');
                      setBankOrderComplete(false);
                    }}
                    className="block w-full border border-black/20 px-5 py-3 text-center text-[11px] uppercase tracking-[0.16em] text-black transition hover:bg-black hover:text-white md:px-8 md:text-xs md:tracking-[0.2em]"
                  >
                    Bank Transfer Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {bankOrderOpen ? (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6 backdrop-blur-sm md:py-10">
            <div className="relative mx-auto my-6 w-[calc(100vw-32px)] max-w-[640px] bg-white p-5 shadow-2xl md:w-full md:p-8">
              <div className="flex items-start justify-between gap-6 border-b border-black/10 pb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-black/50">
                    Bank Transfer Order
                  </p>
                  <h2 className="mt-3 text-lg font-semibold tracking-[0.04em]">
                    계좌이체 주문
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setBankOrderOpen(false)}
                  className="border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em]"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleBankOrderSubmit} className="mt-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm">
                    <span className="text-black/60">이름 *</span>
                    <input
                      required
                      value={bankOrderForm.name}
                      onChange={(e) => updateBankOrderForm('name', e.target.value)}
                      className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="text-black/60">연락처 *</span>
                    <input
                      required
                      value={bankOrderForm.phone}
                      onChange={(e) => updateBankOrderForm('phone', e.target.value)}
                      className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                    />
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="text-black/60">이메일</span>
                  <input
                    type="email"
                    value={bankOrderForm.email}
                    onChange={(e) => updateBankOrderForm('email', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-black/60">주소 *</span>
                  <input
                    required
                    value={bankOrderForm.address}
                    onChange={(e) => updateBankOrderForm('address', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-black/60">상세 주소</span>
                  <input
                    value={bankOrderForm.addressDetail}
                    onChange={(e) => updateBankOrderForm('addressDetail', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-black/60">입금자명 *</span>
                  <input
                    required
                    value={bankOrderForm.depositorName}
                    onChange={(e) => updateBankOrderForm('depositorName', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-black/60">요청사항</span>
                  <textarea
                    rows={4}
                    value={bankOrderForm.memo}
                    onChange={(e) => updateBankOrderForm('memo', e.target.value)}
                    className="mt-2 w-full resize-none border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <div className="grid gap-4 border-t border-black/10 pt-5 text-sm md:grid-cols-2">
                  <div className="space-y-2 text-black/70">
                    <p className="font-medium text-black">주문 상품</p>
                    <p>model 6 × {model6Qty}</p>
                    <p>model 7 × {model7Selected ? 1 : 0}</p>
                    <p>model 6 color: {model6Color || '-'}</p>
                    <p>model 7 color: {model7Selected ? model7Color || '-' : '-'}</p>
                    <p className="font-medium text-black">₩ {formatKRW(total)}</p>
                  </div>

                  <div className="space-y-2 text-black/70">
                    <p className="font-medium text-black">판매자 계좌정보</p>
                    <p>{BANK_NAME}</p>
                    <p>{BANK_ACCOUNT}</p>
                    <p>{ACCOUNT_HOLDER}</p>
                  </div>
                </div>

                <div className="border border-black/10 bg-black/[0.02] p-4 text-sm leading-relaxed text-black/65">
                  <p className="font-medium text-black">주문 전 안내</p>
                  <p className="mt-2">
                    본 제품은 주문 접수 후 제작이 진행되는 수제작 가구로, 입금 및 주문 확인 이후에는 단순 변심에 의한 주문 취소와 환불이 어려운 점 양해 부탁드립니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={bankOrderSubmitting}
                    className="w-full border border-black bg-black px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:px-8 md:text-xs md:tracking-[0.2em]"
                  >
                    {bankOrderSubmitting ? 'Submitting...' : 'Submit Bank Transfer Order'}
                  </button>

                  {bankOrderStatus ? (
                    <p className="text-sm leading-relaxed text-black/60">{bankOrderStatus}</p>
                  ) : null}
                </div>
              </form>

              {bankOrderComplete ? (
                <button
                  type="button"
                  aria-label="Close order complete message"
                  onClick={() => {
                    setBankOrderOpen(false);
                    setBankOrderComplete(false);
                    setBankOrderStatus('');
                  }}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-white px-6 text-center"
                >
                  <span>
                    <CompleteCheckIcon />
                    <span className="mt-6 block text-lg font-medium tracking-[0.04em] text-black">
                      주문이 완료되었습니다
                    </span>
                    <span className="mt-3 block text-sm font-light tracking-[0.08em] text-black">
                      Thank You from xatom
                    </span>
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-20 space-y-6 md:section-shell md:mt-32 md:space-y-8">
          <GalleryImage desktopSrc={imageItems[0].desktopSrc} mobileSrc={imageItems[0].mobileSrc} alt={imageItems[0].alt} eager />
          <GalleryImage desktopSrc={imageItems[1].desktopSrc} mobileSrc={imageItems[1].mobileSrc} alt={imageItems[1].alt} />
        </div>
      </section>

      <footer className="mx-auto mt-32 w-full max-w-[1200px] px-5 pb-16 text-center text-xs font-light leading-snug text-neutral-400 md:px-12 md:text-sm md:leading-tight">
        <div className="mb-5 flex justify-center">
          <Image
            src="/xatom-v3-20260515.png"
            alt="xatom footer logo"
            width={220}
            height={80}
            sizes="(max-width: 768px) 140px, 220px"
            className="h-auto w-[140px] md:w-[220px]"
            priority
          />
        </div>

        <div className="space-y-1.5 md:space-y-2">
          <p>
            © xatom - Contact.{' '}
            <a className="text-emerald-600" href={`mailto:${CONTACT_TO}`}>
              {CONTACT_TO}
            </a>{' '}
            <span className="text-emerald-600">+82 10-4894-8030</span>
          </p>

          <p className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <span>엑스아톰 xatom</span>
            <span>대표자 김대영</span>
            <span>사업자등록번호 107-29-32712</span>
          </p>

          <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-2">
            <span>통신판매신고번호 제 2026-부산남구-0305 호</span>
            <span>부산광역시 남구 전포대로 133, 11층 101(DD-17)</span>
            <Link href="/terms">TERMS OF USE</Link>
          </p>

          <p className="text-neutral-500">2026 © All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
