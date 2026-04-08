import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface TitleProps {
    title: string;
}

const Title = ({ title }: TitleProps) => {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = `${title} | ${t('pageTitles.flowlyt')}`;
    }, [title, t]);

    return <></>;
};

export default Title;
