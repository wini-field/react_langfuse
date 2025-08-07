import React from 'react';
import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'

const Sidebar: React.FC = () => {
    return (
        <aside className = { styles.sidebar }>
            <div className = { styles.searchBar }>
                <span>🔍 Go to...</span>
                <kbd>ctrl k</kbd>
            </div>
            <nav className = { styles.nav }>
                <ul>
                    <li className = { styles.navItem }><Link to = "/"><span className = { styles.icon }>🏠</span> Home</Link></li>
                    <li className = { styles.navItem }><Link to = "/dashboards"><span className = { styles.icon }>🎛</span> Dashboards</Link></li>
                </ul>

                <div className = { styles.navItem }>
                    <div className = { styles.navHeader }>Observability</div>
                    <ul>
                        <li className = { styles.navItem }><Link to = "/tracing"><span className = { styles.icon }>ιχ</span> Tracing</Link></li>
                        <li className = { styles.navItem }><Link to = "/sessions"><span className = { styles.icon }>🕔</span> Sessions</Link></li>
                        <li className = { styles.navItem }><Link to = "/users"><span className = { styles.icon }>👥</span> Users</Link></li>
                    </ul>
                </div>

                <div className = { styles.navItem }>
                    <div className = { styles.navHeader }>Observability</div>
                    <ul>
                        <li className = { styles.navItem }><Link to = "/prompts"><span className = { styles.icon }>ιχ</span> Prompts</Link></li>
                        <li className = { styles.navItem }><Link to = "/playground"><span className = { styles.icon }>🕔</span> Playground</Link></li>
                    </ul>
                </div>
            </nav>
            <div className = { styles.navItem }>
                <div className = { styles.navHeader }>Observability</div>
                <ul>
                    <li className = { styles.navItem }><Link to = "/scores"><span className = { styles.icon }>ιχ</span> scores</Link></li>
                    <li className = { styles.navItem }><Link to = "/llm-as-a-judge"><span className = { styles.icon }>🕔</span> LLM-as-a-Judge</Link></li>
                    <li className = { styles.navItem }><Link to = "/human-annotation"><span className = { styles.icon }>👥</span> Human Annotation</Link></li>
                    <li className = { styles.navItem }><Link to = "/datasets"><span className = { styles.icon }>👥</span> Datasets</Link></li>
                </ul>
            </div>

            <div className = { styles. footer }>
                <ul>
                    <li className = { styles.navItem }><Link to = "/settings"><span className = { styles.icon }>ιχ</span> Settings</Link></li>
                    <li className = { styles.navItem }><Link to = "/support"><span className = { styles.icon }>ιχ</span> Support</Link></li>
                </ul>
                <div className = { styles.userProfile }>
                    <div className = { styles.userInfo }>
                        <div className = { styles.avatar }>K</div>
                        <div>
                            <div className = { styles.userName }>User</div>
                            <div className = { styles.userEmail }>user@wini.co.kr</div>
                        </div>
                    </div>
                    <span></span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;