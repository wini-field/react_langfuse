import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
    Home,
    LayoutDashboard,
    Activity,
    Users,
    MessageCircleCode,
    FlaskConical,
    SquareStack,
    Lightbulb,
    Database,
    Settings,
    UserRound,
    HelpCircle,
    //ChevronLeft,
    //ChevronRight,
    ArrowUpRight,
    Search,
} from "lucide-react";

import styles from "./Layout.module.css";
import ProjectHeader from "./ProjectHeader";

// 타입 선언
type MenuItem = { label: string; icon: JSX.Element; path: string };
type MenuSection = { title: string | null; items: MenuItem[] };

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  const mainMenuSections: MenuSection[] = [
    {
      title: null,
      items: [
        { label: "Home", icon: <Home size={18} />, path: "/" },
        { label: "Dashboards", icon: <LayoutDashboard size={18} />, path: "/dashboards/llm" },
      ],
    },
    {
      title: "Observability",
      items: [
        { label: "Tracing", icon: <Activity size={18} />, path: "/tracing" },
        { label: "Sessions", icon: <MessageCircleCode size={18} />, path: "/sessions" },
        { label: "Users", icon: <Users size={18} />, path: "/users" },
      ],
    },
    {
      title: "Prompt Management",
      items: [
        { label: "Prompts", icon: <FlaskConical size={18} />, path: "/prompts" },
        { label: "Playground", icon: <SquareStack size={18} />, path: "/playground" },
      ],
    },
    {
      title: "Evaluation",
      items: [
        { label: "Scores", icon: <Database size={18} />, path: "/scores" },
        { label: "LLM-as-a-Judge", icon: <Lightbulb size={18} />, path: "/llm-as-a-judge" },
        { label: "Human Annotation", icon: <UserRound size={18} />, path: "/human-annotation" },
        { label: "Datasets", icon: <Database size={18} />, path: "/datasets" },
      ],
    },
  ];

  const bottomMenu: MenuItem[] = [
    { label: "Upgrade", icon: <ArrowUpRight size={18} />, path: "/upgrade" },
    { label: "Settings", icon: <Settings size={18} />, path: "/settings" },
    { label: "Support", icon: <HelpCircle size={18} />, path: "/support" },
  ];

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.menuItem} ${isActive ? styles.active : ""} ${collapsed ? styles.iconOnly : ""}`.trim();

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
            { !collapsed && <div className = { styles.divider } /> }
          {!collapsed && (
            <div className={styles.searchBox} role="search">
                <div className={styles.searchText}>
                  <Search size={12} aria-hidden />
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
                  <div className={styles.sectionTitle}>{section.title}</div>
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
                end={false}
                title={collapsed ? item.label : undefined}
                aria-label={collapsed ? item.label : undefined}
                role="menuitem"
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </ul>

          <div className={styles.userInfo}>
            <img src="/user-profile.png" className={styles.userAvatar} alt="" />
            {!collapsed && (
              <div className={styles.userText}>
                <div className={styles.userName}>test</div>
                <div className={styles.userEmail}>test@test.com</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className={styles.mainContainer}>
          <ProjectHeader onToggleSidebar = { () => setCollapsed(prev => !prev) } />
        <Outlet />
      </main>
    </div>
  );
}
