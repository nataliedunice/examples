import React, { FC, memo } from 'react';
import cn from 'classnames';

import styles from './styles.scss';

import { Textarea } from '@ui';
import { NotificationStatus } from '@types';


type TProps = {
  rows?: number,
  value: string,
  limit: number,
  label?: string,
  className?: string,
  textareaClassName?: string,
  counterClassName?: string,
  placeholder?: string,
  onTextareaChange: (value: string) => void,
  isLabelRequired?: boolean,
  notifications?: string[] | undefined,
  notificationStatus?: NotificationStatus,
  handleBlur?: () => void,
}

const LimitedTextarea: FC<TProps>  = ({
                                        rows,
                                        value,
                                        limit,
                                        label,
                                        className,
                                        textareaClassName,
                                        counterClassName,
                                        placeholder,
                                        onTextareaChange,
                                        isLabelRequired,
                                        notificationStatus,
                                        notifications,
                                        handleBlur
                                      }) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    value.length > limit ? onTextareaChange(value.slice(0, limit)) : onTextareaChange(value);
  };

  return (
    <div className={className}>
      <Textarea
        className={cn(textareaClassName, isLabelRequired && styles.requiredLabel)}
        rows={rows}
        label={label}
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
        onBlur={handleBlur}
        notificationStatus={notificationStatus}
        notifications={notifications}
      >
      </Textarea>
      {notificationStatus !== NotificationStatus.ERROR && (
        <p className={cn(styles.counter, counterClassName, (value.length === limit) ? styles.counterWarning : '')}>
          {value.length}/{limit}
        </p>
      )}
    </div>
  )
};

export default memo(LimitedTextarea);
