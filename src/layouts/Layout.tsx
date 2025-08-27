import {useState, useMemo, useRef, useEffect} from "react";
import {Outlet, NavLink, matchPath, useLocation, useNavigate} from "react-router-dom";
import {
    Home,
    LayoutDashboard,
    Activity,
    MessageCircleCode,
    FlaskConical,
    SquareStack,
    Lightbulb,
    Database,
    Settings,
    Search,
    ChevronDown,
} from "lucide-react";

import styles from "./Layout.module.css";
import PageHeader from "../components/PageHeader/PageHeader";

// 타입 선언
type MenuItem = { label: string; icon: JSX.Element; path: string };
type MenuSection = { title: string | null; items: MenuItem[] };

/* 자식 라우트가 헤더를 덮어쓸 때 사용하는 타입 */
type HeaderConfig = {
    title?: React.ReactNode;
    rightActions?: React.ReactNode;
};

// 세션 정보 타입 (App.jsx에서 넘어오는 데이터 기준)
type Session = {
    user?: {
        name?: string;
        email?: string;
        image?: string;
    }
}

export default function Layout({session}: { session: Session }) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // ★ 자식이 setHeader로 덮어쓸 전역 헤더 상태
    const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({});

    // --- ▼ 사용자 메뉴 팝업 관련 상태 및 로직 ▼ ---
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // 팝업 외부 클릭 시 닫기
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuRef]);

    // 로그아웃 핸들러
    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/signout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            });
        } catch (error) {
            console.error("Sign out failed", error);
        } finally {
            window.location.href = '/login'; // 성공 여부와 관계없이 로그인 페이지로 이동
        }
    };
    // --- ▲ 사용자 메뉴 팝업 관련 상태 및 로직 ▲ ---

    const mainMenuSections: MenuSection[] = [
        {
            title: null,
            items: [
                {label: "Home", icon: <Home size={18}/>, path: "/"},
            ],
        },
        {
            title: "Tracing",
            items: [
                {label: "Trace", icon: <Activity size={18}/>, path: "/trace"},
                {label: "Span", icon: <Activity size={18}/>, path: "/span"},
                {label: "Sessions", icon: <MessageCircleCode size={18}/>, path: "/sessions"},
            ],
        },
        {
            title: "Evaluation",
            items: [
                {label: "LLM-as-a-Judge", icon: <Lightbulb size={18}/>, path: "/llm-as-a-judge"},
                {label: "Datasets", icon: <Database size={18}/>, path: "/datasets"},
            ],
        },
        {
            title: "Dashboards",
            items: [
                {label: "Dashboards", icon: <LayoutDashboard size={18}/>, path: "/dashboards"},
            ],
        },
        {
            title: "Prompt Management",
            items: [
                {label: "Prompts", icon: <FlaskConical size={18}/>, path: "/prompts"},
                {label: "Playground", icon: <SquareStack size={18}/>, path: "/playground"},
            ],
        },
    ];

    const bottomMenu: MenuItem[] = [
        {label: "Settings", icon: <Settings size={18}/>, path: "/settings"},
    ];

    const navClass = ({isActive}: { isActive: boolean }) =>
        `${styles.menuItem} ${isActive ? styles.active : ""} ${collapsed ? styles.iconOnly : ""}`.trim();

    // 현재 경로가 섹션의 어떤 item과도 매치되면 true → 섹션 타이틀 강조
    const sectionActive = (section: MenuSection) =>
        section.items.some(({path}) =>
            !!matchPath({path, end: path === "/"}, location.pathname) ||
            (path !== "/" && location.pathname.startsWith(path))
        );

    const pageTitle = useMemo(() => {
        const p = location.pathname;
        if (p === "/") return "Home";
        if (p.startsWith("/llm-as-a-judge")) return "LLM-as-a-Judge Evaluators";
        if (p.startsWith("/datasets")) return "Datasets";
        if (p.startsWith("/scores")) return "Evaluators";
        if (p.startsWith("/dashboards/llm")) return "LLM Dashboard";
        if (p.startsWith("/prompts")) return "Prompts";
        if (p.startsWith("/playground")) return "Playground";
        if (p.startsWith("/trace")) return "Trace";
        if (p.startsWith("/span")) return "Span";
        if (p.startsWith("/sessions")) return "Sessions";
        if (p.startsWith("/settings")) return "Settings";
        return "Langfuse";
    }, [location.pathname]);

    // 기본 헤더 오른쪽 액션 (자식이 덮어쓰지 않을 때만 사용)
    const headerRightActionsDefault = useMemo(() => {
        const p = location.pathname;
        if (p.startsWith("/datasets")) {
            return (
                <button
                    type="button"
                    className={`${styles.headerActionPrimary ?? ""}`.trim()}
                    style={{cursor: "pointer"}}
                    onClick={() => navigate("/datasets?new=1")}
                >
                    + New dataset
                </button>
            );
        }
        return null;
    }, [location.pathname, navigate]);


    return (
        <div className={styles.layout}>
            <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
                {/* [1] 상단 고정 */}
                <div className={styles.header}>
                    <div className={styles.logoArea}>
                        <div className={styles.logoText}>
                            {!collapsed && <span>Langfuse</span>}
                        </div>
                    </div>
                    {!collapsed && <div className={styles.divider}/>}
                    {!collapsed && (
                        <div className={styles.searchBox} role="search">
                            <div className={styles.searchText}>
                                <Search size={12} aria-hidden/>
                                <span>Go to...</span>
                            </div>
                            <span className={styles.hotkey}>Ctrl K</span>
                        </div>
                    )}
                </div>

                {/* [2] 중간 스크롤 가능한 메뉴 */}
                <div className={styles.menuWrapper}>
                    <ul className={styles.menu} role="menu" aria-label="Main navigation">
                        {mainMenuSections.map((section, i) => (
                            <li key={i}>
                                {section.title && !collapsed && (
                                    <div className={`${styles.sectionTitle} ${
                                        sectionActive(section) ? styles.sectionTitleActive : ""
                                    }`}>{section.title}</div>
                                )}
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.path}
                                        className={navClass}
                                        end={item.path === "/"}
                                        // 접힘 상태에서 툴팁/스크린리더 라벨 제공
                                        title={collapsed ? item.label : undefined}
                                        aria-label={collapsed ? item.label : undefined}
                                        role="menuitem"
                                    >
                                        {item.icon}
                                        {!collapsed && <span>{item.label}</span>}
                                    </NavLink>
                                ))}
                                {i < mainMenuSections.length - 1 && (
                                    <div className={styles.sectionDivider}></div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* [3] 하단 고정 */}
                <div>
                    <ul className={`${styles.menu} ${styles.bottomMenu}`} role="menu" aria-label="Secondary navigation">
                        {bottomMenu.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                className={navClass}
                                title={collapsed ? item.label : undefined}
                                aria-label={collapsed ? item.label : undefined}
                                role="menuitem"
                            >
                                {item.icon}
                                {!collapsed && <span>{item.label}</span>}
                            </NavLink>
                        ))}
                    </ul>

                    <div ref={userMenuRef} className={styles.userMenuContainer}>
                        {isUserMenuOpen && !collapsed && (
                            <div className={styles.userMenuPopover}>
                                <div className={styles.popoverUserInfo}>
                                    <div className={styles.popoverAvatar}>
                                        {session.user?.name?.charAt(0).toUpperCase() || 'T'}
                                    </div>
                                    <div className={styles.popoverUserText}>
                                        <div className={styles.popoverUserName}>{session.user?.name || 'test'}</div>
                                        <div
                                            className={styles.popoverUserEmail}>{session.user?.email || 'test@test.com'}</div>
                                    </div>
                                </div>
                                <div className={styles.popoverSection}>
                                    <button className={styles.signOutButton} onClick={handleSignOut}>
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={styles.userInfo} onClick={() => setIsUserMenuOpen(prev => !prev)}>
                            <div className={styles.userAvatar}>
                                {session.user?.name?.charAt(0).toUpperCase() || 'T'}
                            </div>
                            {!collapsed && (
                                <>
                                    <div className={styles.userText}>
                                        <div className={styles.userName}>{session.user?.name || 'test'}</div>
                                        <div className={styles.userEmail}>{session.user?.email || 'test@test.com'}</div>
                                    </div>
                                    <div className={styles.userMenuToggle}>
                                        <ChevronDown size={14} style={{
                                            transform: isUserMenuOpen ? 'rotate(180deg)' : 'none',
                                            transition: 'transform 0.2s'
                                        }}/>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            <main className={styles.mainContainer}>
                <PageHeader
                    orgName="Organization"
                    projectName="Project"
                    envBadge="Hobby"
                    title={headerConfig.title ?? pageTitle}
                    onToggleSidebar={() => setCollapsed((prev) => !prev)}
                    flushLeft
                    rightActions={headerConfig.rightActions ?? headerRightActionsDefault}
                />
                <div className={styles.pageBody}>
                    {/* ★ 자식 라우트에 전역 헤더 세터 제공 */}
                    <Outlet context={{setHeader: setHeaderConfig}}/>
                </div>
            </main>
        </div>
    );
}
