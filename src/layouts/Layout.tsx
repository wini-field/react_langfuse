import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Search
} from "lucide-react";

import styles from "./Layout.module.css";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const mainMenuSections = [
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

  const bottomMenu = [
    { label: "Upgrade", icon: <ArrowUpRight size={18} />, path: "/upgrade" },
    { label: "Settings", icon: <Settings size={18} />, path: "/settings" },
    { label: "Support", icon: <HelpCircle size={18} />, path: "/support" },
  ];

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
        {/* [1] 상단 고정 */}
        <div className={styles.header}>
          <div className={styles.logoText}>
            {!collapsed && <span>Langfuse</span>}
            <button
              className={styles.toggleButton}
              onClick={() => setCollapsed(prev => !prev)}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          {!collapsed && (
            <div className={styles.searchBox}>
              <Search size={12} />
              <span>Go to... (Ctrl+K)</span>
            </div>
          )}
        </div>

        {/* [2] 중간 스크롤 가능한 메뉴 */}
        <div className={styles.menuWrapper}>
          <ul className={styles.menu}>
            {mainMenuSections.map((section, i) => (
              <li key={i}>
                {section.title && !collapsed && (
                  <div className={styles.sectionTitle}>{section.title}</div>
                )}
                {section.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.path}
                    className={`${styles.menuItem} ${collapsed ? styles.iconOnly : ""}`}
                    style={{
                      backgroundColor: location.pathname === item.path ? "#1e293b" : "transparent",
                    }}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </a>
                ))}
                {i < mainMenuSections.length - 1 && (
                  <div className={styles.sectionDivider}></div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* [3] 하단 고정 */}
        <div className={styles.bottomArea}>
          <ul className={`${styles.menu} ${styles.bottomMenu}`}>
            {bottomMenu.map((item) => (
              <a
                key={item.label}
                href={item.path}
                className={`${styles.menuItem} ${collapsed ? styles.iconOnly : ""}`}
                style={{
                  backgroundColor: location.pathname === item.path ? "#1e293b" : "transparent",
                }}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </a>
            ))}
          </ul>

          <div className={styles.userInfo}>
            <img src="/user-profile.png" className={styles.userAvatar} />
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
        <Outlet />
      </main>
    </div>
  );
}
