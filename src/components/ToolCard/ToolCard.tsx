import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import styles from './ToolCard.module.css';

interface ToolCardProps {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export function ToolCard({ to, icon, title, description }: ToolCardProps) {
  return (
    <Link to={to} className={styles.card}>
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </Link>
  );
}
