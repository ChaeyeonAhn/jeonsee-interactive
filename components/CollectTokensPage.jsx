"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function CollectTokensPage() {
    const TARGET_TOKENS = 10;

    // 고정된 초기 위치로 토큰 생성
    const [tokens, setTokens] = useState(
        Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: 15 + (i % 5) * 18, // 5열로 배치
            y: 20 + Math.floor(i / 5) * 25, // 3행으로 배치
            vx: ((i % 3) - 1) * 0.3, // -0.3, 0, 0.3 패턴
            vy: ((i % 2) - 0.5) * 0.3, // -0.15, 0.15 패턴
            collected: false,
        }))
    );

    const [collected, setCollected] = useState(0);
    const [showComplete, setShowComplete] = useState(false);

    // 재화 움직임 애니메이션
    useEffect(() => {
        const interval = setInterval(() => {
            setTokens(prevTokens =>
                prevTokens.map(token => {
                    if (token.collected) return token;

                    let newX = token.x + token.vx;
                    let newY = token.y + token.vy;
                    let newVx = token.vx;
                    let newVy = token.vy;

                    // 벽에 부딪히면 반사
                    if (newX <= 5 || newX >= 95) {
                        newVx = -token.vx;
                        newX = newX <= 5 ? 5 : 95;
                    }
                    if (newY <= 5 || newY >= 95) {
                        newVy = -token.vy;
                        newY = newY <= 5 ? 5 : 95;
                    }

                    return { ...token, x: newX, y: newY, vx: newVx, vy: newVy };
                })
            );
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // 완료 체크 (useEffect로 분리)
    useEffect(() => {
        if (collected >= TARGET_TOKENS && !showComplete) {
            const timer = setTimeout(() => setShowComplete(true), 500);
            return () => clearTimeout(timer);
        }
    }, [collected, showComplete]);

    // 재화 수집
    const collectToken = (id) => {
        setTokens(prevTokens =>
            prevTokens.map(token =>
                token.id === id ? { ...token, collected: true } : token
            )
        );
        setCollected(prev => prev + 1);
    };

    // 마운트되기 전에는 로딩 표시
    // if (!mounted) {
    //     return (
    //         <div className="relative w-full h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden flex items-center justify-center">
    //             <div className="text-white text-2xl">Loading...</div>
    //         </div>
    //     );
    // }

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
            {/* 배경 그리드 효과 */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* 헤더 */}
            <div className="relative z-10 pt-12 px-8 text-center">
                <h1 className="text-5xl font-bold text-white mb-4">
                    전<span className="text-yellow-300">SEE</span>에 오신 것을 환영합니다
                </h1>
                <p className="text-xl text-purple-200 mb-2">
                    자유롭게 떠다니는 관람권을 수집해보세요!
                </p>
                <p className="text-lg text-purple-300">
                    관람권은 다른 사람의 전시를 관람하는데 사용됩니다
                </p>
            </div>

            {/* 수집 현황 */}
            <div className="relative z-10 mt-8 text-center">
                <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border-2 border-white/30">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-yellow-300" size={32} />
                        <span className="text-4xl font-bold text-white">
              {collected} / {TARGET_TOKENS}
            </span>
                    </div>
                </div>
            </div>

            {/* 재화들 */}
            <div className="absolute inset-0">
                {tokens.map(token => (
                    !token.collected && (
                        <button
                            key={token.id}
                            onClick={() => collectToken(token.id)}
                            className="absolute transition-all duration-100 hover:scale-125 cursor-pointer"
                            style={{
                                left: `${token.x}%`,
                                top: `${token.y}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <div className="relative">
                                {/* 반짝이는 효과 */}
                                <div className="absolute inset-0 animate-ping">
                                    <Sparkles className="text-yellow-300" size={40} />
                                </div>
                                <Sparkles className="text-yellow-400 drop-shadow-lg" size={40} />
                            </div>
                        </button>
                    )
                ))}
            </div>

            {/* 완료 모달 */}
            {showComplete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-12 max-w-md text-center transform animate-bounce">
                        <div className="mb-6">
                            <Sparkles className="text-yellow-500 mx-auto animate-spin" size={80} />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            축하합니다! 🎉
                        </h2>
                        <p className="text-xl text-gray-600 mb-6">
                            {TARGET_TOKENS}개의 관람권을 모으셨습니다!
                        </p>
                        <p className="text-gray-500 mb-8">
                            이제 다른 사람들의 멋진 전시를 관람하거나,<br />
                            당신만의 전시를 올려보세요!
                        </p>
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform">
                            전시 둘러보기 →
                        </button>
                    </div>
                </div>
            )}

            {/* 안내 문구 */}
            {collected < TARGET_TOKENS && (
                <div className="absolute bottom-12 left-0 right-0 text-center">
                    <p className="text-white/70 text-sm animate-pulse">
                        💡 떠다니는 아이콘을 클릭하여 수집하세요
                    </p>
                </div>
            )}
        </div>
    );
}