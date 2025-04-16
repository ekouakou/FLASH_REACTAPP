import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Steps,
  Panel,
  Button,
  Grid,
  Row,
  Col,
  Form,
  FlexboxGrid,
  List,
  Message,
  Modal,
  useMediaQuery,
  Loader,
  Animation,
  Whisper,
  Tooltip,
  Divider,
  Progress,
  Schema
} from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';

// ========== SYSTÈME DE DESIGN AFG BANK CI ==========

// Palette de couleurs AFG Bank CI - Version Premium
const COLORS = {
  // Couleurs principales
  primary: {
    900: '#051638', // Très foncé - pour contraste élevé
    800: '#0A2557', // Bleu royal AFG Bank principal
    700: '#0F3275', // Version légèrement plus claire - boutons hover
    600: '#1B448C', // Accents 
    500: '#2756A3', // Bleu intermédiaire
    400: '#3868B9', // Éléments interactifs
    300: '#5D83C7', // Bleu clair
    200: '#8CA9D9', // Très clair
    100: '#C5D2EB', // Ultra clair 
    50: '#E6EAF2',  // Fond bleuté
  },
  // Couleurs secondaires 
  secondary: {
    900: '#8C6717', // Or foncé
    800: '#A57B1B', // Or moyen foncé
    700: '#B88A1E', // Or moyen
    600: '#CC9933', // Or/ocre AFG Bank standard
    500: '#D5A84F', // Or clair
    400: '#DEB86B', // Or très clair
    300: '#E6C988', // Or pâle
    200: '#EEDBAA', // Or ultra-clair
    100: '#F6EDCC', // Or pâle
    50: '#F9F5E6',  // Fond doré subtil
  },
  // Système de feedback
  success: {
    800: '#00683A', // Vert foncé
    600: '#00874A', // Vert principal
    400: '#00A65B', // Vert clair
    200: '#CCE8D9', // Fond vert pâle
  },
  warning: {
    800: '#A06D10', // Orange foncé
    600: '#CB8A14', // Orange principal
    400: '#F0A92F', // Orange clair
    200: '#F8E8CC', // Fond orange pâle
  },
  danger: {
    800: '#8F212F', // Rouge foncé
    600: '#B2293A', // Rouge principal
    400: '#D53349', // Rouge clair
    200: '#F8D7DC', // Fond rouge pâle
  },
  // Système de neutrals
  neutral: {
    900: '#1A1A2E', // Texte principal
    800: '#2A2A3F', // Texte fort
    700: '#3A3A50', // Texte standard
    600: '#5A6685', // Texte secondaire
    500: '#7A869F', // Texte désactivé
    400: '#9AA6B9', // Bordures fortes
    300: '#BFC7D4', // Bordures standards
    200: '#D8DEE9', // Bordures légères
    100: '#E9ECF3', // Séparateurs
    50: '#F8F9FC',  // Fond clair
  }
};

// Système typographique
const TYPOGRAPHY = {
  fontFamily: {
    primary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    secondary: "'Georgia', serif", // Pour éléments mettant en avant la confiance/tradition
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
    wider: '0.02em',
    widest: '0.05em',
  }
};

// Système de border-radius
const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',   // Cercle/pill
};

// Système d'ombres
const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px rgba(10, 37, 87, 0.05)',
  sm: '0 2px 4px rgba(10, 37, 87, 0.08)',
  md: '0 4px 8px rgba(10, 37, 87, 0.12)',
  lg: '0 8px 16px rgba(10, 37, 87, 0.08)',
  xl: '0 16px 32px rgba(10, 37, 87, 0.08)',
  inner: 'inset 0 2px 4px rgba(10, 37, 87, 0.05)',
  outline: '0 0 0 3px rgba(10, 37, 87, 0.2)',
  focused: '0 0 0 4px rgba(39, 86, 163, 0.3)',
};

// Système d'espacement
const SPACING = {
  px: '1px',
  '0': '0',
  '0.5': '0.125rem',  // 2px
  '1': '0.25rem',     // 4px
  '2': '0.5rem',      // 8px
  '3': '0.75rem',     // 12px
  '4': '1rem',        // 16px
  '5': '1.25rem',     // 20px
  '6': '1.5rem',      // 24px
  '8': '2rem',        // 32px
  '10': '2.5rem',     // 40px
  '12': '3rem',       // 48px
  '16': '4rem',       // 64px
  '20': '5rem',       // 80px
  '24': '6rem',       // 96px
  '32': '8rem',       // 128px
};

// Système d'opacité
const OPACITY = {
  '0': '0',
  '5': '0.05',
  '10': '0.1',
  '15': '0.15',
  '20': '0.2',
  '25': '0.25',
  '40': '0.4',
  '50': '0.5',
  '60': '0.6',
  '75': '0.75',
  '80': '0.8',
  '90': '0.9',
  '95': '0.95',
  '100': '1',
};

// Système de z-index
const Z_INDEX = {
  auto: 'auto',
  '0': '0',
  '10': '10',
  '20': '20',
  '30': '30',
  '40': '40',
  '50': '50',
  '100': '100',
  '200': '200',
  '500': '500',
  '1000': '1000',
};

// Durées d'animation
const ANIMATION = {
  faster: '100ms',
  fast: '200ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
};

// Courbes d'accélération
const EASING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  premium: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// Icônes de service avec emojis (solution temporaire)
const SERVICE_ICONS = {
  information: "ℹ️",
  consultation: "📅",
  paiement: "💳",
  reclamation: "💬",
  livraison: "📦",
  reparation: "🔧"
};

// Animation de fade pour les transitions
const { Fade } = Animation;

// ========== ANIMATIONS ==========

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(204, 153, 51, 0.6);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(204, 153, 51, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(204, 153, 51, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const subtleAppear = keyframes`
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// ========== MIXINS ET STYLES UTILITAIRES ==========

// Mixin pour les transitions premium
const premiumTransition = (property = 'all') => css`
  transition: ${property} ${ANIMATION.normal} ${EASING.premium};
`;

// Mixin pour les designs card premium
const premiumCard = css`
  background-color: white;
  border-radius: ${BORDER_RADIUS.lg};
  box-shadow: ${SHADOWS.md};
  ${premiumTransition()};
  
  &:hover {
    box-shadow: ${SHADOWS.lg};
    transform: translateY(-2px);
  }
`;

// Mixin pour les styles de focus accessibles
const accessibleFocus = css`
  &:focus {
    outline: none;
    box-shadow: ${SHADOWS.focused};
  }
`;

// ========== COMPOSANTS STYLISÉS GLOBAUX ==========

// Styles globaux pour affecter rsuite et réinitialiser certains styles par défaut
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body, html {
    font-family: ${TYPOGRAPHY.fontFamily.primary};
    color: ${COLORS.neutral[800]};
    background-color: ${COLORS.neutral[50]};
    line-height: ${TYPOGRAPHY.lineHeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Styles RSuite personnalisés */
  .rs-steps-item-status-process .rs-steps-item-icon-wrapper {
    background-color: ${COLORS.primary[800]};
    border-color: ${COLORS.primary[800]};
  }
  
  .rs-steps-item-status-finish .rs-steps-item-icon-wrapper {
    background-color: white;
    color: ${COLORS.primary[800]};
    border-color: ${COLORS.primary[800]};
  }
  
  .rs-steps-item-status-process .rs-steps-item-title,
  .rs-steps-item-status-finish .rs-steps-item-title {
    color: ${COLORS.primary[800]};
    font-weight: ${TYPOGRAPHY.fontWeight.medium};
  }
  
  .rs-steps-item-description {
    color: ${COLORS.neutral[600]};
  }
  
  .rs-btn-primary {
    background-color: ${COLORS.primary[800]};
    border-color: ${COLORS.primary[800]};
    font-weight: ${TYPOGRAPHY.fontWeight.medium};
    ${premiumTransition('all')};
  }
  
  .rs-btn-primary:hover, .rs-btn-primary:focus {
    background-color: ${COLORS.primary[700]};
    border-color: ${COLORS.primary[700]};
    box-shadow: ${SHADOWS.md};
    transform: translateY(-1px);
  }
  
  .rs-btn-subtle {
    ${premiumTransition('all')};
  }
  
  .rs-btn-subtle:hover {
    background-color: ${COLORS.neutral[100]};
  }
  
  .rs-input {
    border-radius: ${BORDER_RADIUS.md};
    padding: ${SPACING['3']} ${SPACING['4']};
    border-color: ${COLORS.neutral[200]};
    ${premiumTransition('border-color, box-shadow')};
  }
  
  .rs-input:focus {
    border-color: ${COLORS.primary[400]};
    box-shadow: ${SHADOWS.focused};
  }
  
  .rs-message {
    border-radius: ${BORDER_RADIUS.md};
    border-left-width: 4px;
  }
  
  .rs-form-control-label {
    font-weight: ${TYPOGRAPHY.fontWeight.medium};
    color: ${COLORS.neutral[800]};
    margin-bottom: ${SPACING['2']};
  }
  
  .rs-form-help-text {
    font-size: ${TYPOGRAPHY.fontSize.sm};
    color: ${COLORS.neutral[600]};
    margin-top: ${SPACING['1']};
  }
  
  .rs-form-group {
    margin-bottom: ${SPACING['5']};
  }
  
  .rs-form-error-message {
    color: ${COLORS.danger[600]};
    margin-top: ${SPACING['1']};
  }
  
  .rs-modal {
    border-radius: ${BORDER_RADIUS.xl};
    overflow: hidden;
  }
  
  .rs-modal-header {
    border-bottom-color: ${COLORS.neutral[200]};
    padding: ${SPACING['6']} ${SPACING['6']} ${SPACING['4']};
  }
  
  .rs-modal-title {
    color: ${COLORS.primary[800]};
    font-weight: ${TYPOGRAPHY.fontWeight.semibold};
    font-size: ${TYPOGRAPHY.fontSize.xl};
  }
  
  .rs-modal-body {
    padding: ${SPACING['4']} ${SPACING['6']};
  }
  
  .rs-modal-footer {
    border-top-color: ${COLORS.neutral[200]};
    padding: ${SPACING['4']} ${SPACING['6']} ${SPACING['6']};
  }
  
  .rs-list-item {
    transition: background ${ANIMATION.fast} ${EASING.easeOut};
    padding: ${SPACING['4']} ${SPACING['4']};
  }
  
  .rs-list-bordered {
    border-color: ${COLORS.neutral[200]};
    border-radius: ${BORDER_RADIUS.md};
  }
  
  .rs-loader-content {
    color: ${COLORS.primary[800]};
  }
  
  .rs-loader-spin::before {
    border-top-color: ${COLORS.primary[800]};
  }
  
  .rs-progress-line-bg {
    background-color: ${COLORS.neutral[200]};
  }
  
  .rs-progress-line-inner {
    background-color: ${COLORS.primary[600]};
    transition: width 0.6s ${EASING.premium};
  }
`;

// ========== ÉLÉMENTS STYLISÉS ==========

const WizardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.isMobile ? SPACING['4'] : SPACING['6']};
  font-family: ${TYPOGRAPHY.fontFamily.primary};
  animation: ${subtleAppear} ${ANIMATION.slow} ${EASING.premium} forwards;
`;

const WizardHeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${SPACING['8']};
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${SPACING['6']};
`;

const AFGBankLogo = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily.secondary};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-size: ${TYPOGRAPHY.fontSize['2xl']};
  color: ${COLORS.primary[800]};
  display: flex;
  align-items: center;
  letter-spacing: ${TYPOGRAPHY.letterSpacing.wider};
  
  &::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: ${COLORS.secondary[600]};
    margin-right: ${SPACING['2']};
    border-radius: ${BORDER_RADIUS.sm};
  }
`;

const WizardTitle = styled.h1`
  text-align: center;
  color: ${COLORS.primary[800]};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-size: ${props => props.isMobile ? TYPOGRAPHY.fontSize['2xl'] : TYPOGRAPHY.fontSize['4xl']};
  position: relative;
  margin-bottom: ${SPACING['6']};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -${SPACING['4']};
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: ${COLORS.secondary[600]};
    border-radius: ${BORDER_RADIUS.full};
  }
`;

const WizardSubtitle = styled.p`
  color: ${COLORS.neutral[600]};
  font-size: ${TYPOGRAPHY.fontSize.lg};
  max-width: 700px;
  margin: 0 auto;
  line-height: ${TYPOGRAPHY.lineHeight.relaxed};
`;

const WizardLayout = styled.div`
  display: flex;
  flex-direction: ${props => props.isMobile ? 'column' : 'row'};
  width: 100%;
  position: relative;
`;

const StepsContainer = styled.div`
  width: ${props => props.isMobile ? '100%' : '25%'};
  margin-right: ${props => props.isMobile ? 0 : SPACING['6']};
  margin-bottom: ${props => props.isMobile ? SPACING['6'] : 0};
  position: relative;
`;

const StepsPanel = styled.div`
  background-color: white;
  border-radius: ${BORDER_RADIUS.lg};
  padding: ${SPACING['6']};
  box-shadow: ${SHADOWS.sm};
  height: 100%;
`;

const ProgressIndicator = styled.div`
  margin: ${SPACING['4']} 0;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${SPACING['2']} 0 ${SPACING['4']};
  padding: 0 ${SPACING['2']};
`;

const StepNumber = styled.span`
  color: ${COLORS.neutral[600]};
  font-size: ${TYPOGRAPHY.fontSize.sm};
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
`;

const StepName = styled.span`
  color: ${props => props.color || COLORS.primary[800]};
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  font-size: ${TYPOGRAPHY.fontSize.sm};
`;

const ContentContainer = styled.div`
  width: ${props => props.isMobile ? '100%' : '75%'};
  position: relative;
`;

const ContentPanel = styled(Panel)`
  padding: ${props => props.isMobile ? SPACING['6'] : SPACING['8']};
  border-radius: ${BORDER_RADIUS.lg};
  box-shadow: ${SHADOWS.md};
  min-height: 450px;
  border: 1px solid ${COLORS.neutral[200]};
  background-color: white;
  transition: all ${ANIMATION.normal} ${EASING.premium};
  animation: ${fadeInUp} ${ANIMATION.normal} ${EASING.premium} forwards;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SectionHeading = styled.h2`
  margin-bottom: ${SPACING['4']};
  color: ${COLORS.neutral[800]};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  position: relative;
  font-size: ${TYPOGRAPHY.fontSize.xl};
  
  &::after {
    content: '';
    height: 3px;
    width: 50px;
    background: ${props => props.color || COLORS.primary[800]};
    position: absolute;
    bottom: -${SPACING['2']};
    left: 0;
    border-radius: ${BORDER_RADIUS.full};
  }
`;

const SectionDescription = styled.p`
  margin-bottom: ${SPACING['6']};
  color: ${COLORS.neutral[600]};
  font-size: ${TYPOGRAPHY.fontSize.md};
  line-height: ${TYPOGRAPHY.lineHeight.relaxed};
`;

const ServiceCard = styled.div`
  padding: ${SPACING['6']};
  border-radius: ${BORDER_RADIUS.lg};
  border: 2px solid ${props => props.isSelected ? props.color : COLORS.neutral[200]};
  cursor: ${props => props.selectionDelay ? 'default' : 'pointer'};
  transition: all ${ANIMATION.normal} ${EASING.premium};
  background-color: ${props => props.isSelected ? `${props.color}${OPACITY[5]}` : 'white'};
  box-shadow: ${props => props.isSelected ? SHADOWS.lg : SHADOWS.sm};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: ${props => props.isSelected ? 'translateY(-3px)' : 'translateY(0)'};
  position: relative;
  overflow: hidden;
  opacity: ${props => props.selectionDelay && !props.isSelected ? OPACITY[50] : OPACITY[100]};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: ${props => props.color};
    opacity: ${props => props.isSelected ? OPACITY[100] : OPACITY[0]};
    transition: opacity ${ANIMATION.normal} ${EASING.premium};
  }
  
  &:hover {
    transform: ${props => (!props.selectionDelay && !props.isSelected) ? 'translateY(-2px)' : props.isSelected ? 'translateY(-3px)' : 'translateY(0)'};
    box-shadow: ${props => (!props.selectionDelay && !props.isSelected) ? SHADOWS.md : props.isSelected ? SHADOWS.lg : SHADOWS.sm};
    border-color: ${props => (!props.selectionDelay && !props.isSelected) ? `${props.color}${OPACITY[40]}` : props.isSelected ? props.color : COLORS.neutral[200]};
    
    &::before {
      opacity: ${props => props.isSelected ? OPACITY[100] : OPACITY[40]};
    }
  }
  
  ${accessibleFocus}
`;

const CheckMark = styled.div`
  position: absolute;
  top: ${SPACING['3']};
  right: ${SPACING['3']};
  background-color: ${props => props.color};
  color: white;
  border-radius: ${BORDER_RADIUS.full};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${TYPOGRAPHY.fontSize.xs};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  animation: ${pulse} 2s infinite;
`;

const ServiceIcon = styled.div`
  font-size: 38px;
  margin-bottom: ${SPACING['3']};
  color: ${props => props.isSelected ? props.color : COLORS.neutral[500]};
  transition: all ${ANIMATION.normal} ${EASING.premium};
  transform: ${props => props.isSelected ? 'scale(1.1)' : 'scale(1)'};
`;

const ServiceName = styled.h4`
  margin: ${SPACING['2']} 0;
  text-align: center;
  color: ${props => props.isSelected ? props.color : COLORS.neutral[800]};
  font-weight: ${props => props.isSelected ? TYPOGRAPHY.fontWeight.semibold : TYPOGRAPHY.fontWeight.medium};
  font-size: ${TYPOGRAPHY.fontSize.lg};
`;

const ServiceDescription = styled.p`
  margin: 0;
  text-align: center;
  color: ${COLORS.neutral[600]};
  font-size: ${TYPOGRAPHY.fontSize.sm};
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: ${props => props.position || 'flex-end'};
  margin-top: ${SPACING['6']};
  gap: ${SPACING['3']};
`;

const PrimaryButton = styled(Button)`
  padding: ${SPACING['3']} ${SPACING['6']};
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  border-radius: ${BORDER_RADIUS.md};
  
  ${props => props.disabled && css`
    opacity: ${OPACITY[60]};
  `}
`;

const SecondaryButton = styled(Button)`
  padding: ${SPACING['3']} ${SPACING['6']};
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  border-radius: ${BORDER_RADIUS.md};
`;

const TicketContainer = styled.div`
  text-align: center;
  animation: ${fadeInUp} ${ANIMATION.normal} ${EASING.premium} forwards;
`;

const TicketSuccessIcon = styled.div`
  color: ${COLORS.success[600]};
  font-size: 80px;
  margin-bottom: ${SPACING['6']};
  display: flex;
  justify-content: center;
`;

const TicketTitle = styled.h3`
  color: ${COLORS.neutral[800]};
  margin-bottom: ${SPACING['4']};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  font-size: ${TYPOGRAPHY.fontSize['2xl']};
`;

const TicketCard = styled.div`
  background: linear-gradient(135deg, ${COLORS.primary[50]}, white);
  border-radius: ${BORDER_RADIUS.lg};
  padding: ${SPACING['6']};
  margin: ${SPACING['6']} auto;
  max-width: 320px;
  border: 2px dashed ${COLORS.primary[800]};
  position: relative;
  transition: all ${ANIMATION.normal} ${EASING.premium};
  
  &::before {
    content: '';
    position: absolute;
    top: -${SPACING['2']};
    left: -${SPACING['2']};
    right: -${SPACING['2']};
    bottom: -${SPACING['2']};
    background: linear-gradient(45deg, ${COLORS.secondary[600]}${OPACITY[20]}, transparent);
    border-radius: ${BORDER_RADIUS.xl};
    z-index: -1;
    opacity: ${OPACITY[80]};
  }
  
  &:hover {
    box-shadow: ${SHADOWS.xl};
    transform: translateY(-2px) scale(1.02);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, ${COLORS.secondary[100]}${OPACITY[50]}, transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
    border-radius: ${BORDER_RADIUS.lg};
  }
`;

const BankLogo = styled.div`
  position: absolute;
  top: ${SPACING['3']};
  right: ${SPACING['3']};
  color: ${COLORS.primary[800]};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  letter-spacing: ${TYPOGRAPHY.letterSpacing.wider};
  font-size: ${TYPOGRAPHY.fontSize.xs};
  opacity: ${OPACITY[70]};
`;

const TicketLabel = styled.p`
  font-size: ${TYPOGRAPHY.fontSize.md};
  margin: 0 0 ${SPACING['2']} 0;
  color: ${COLORS.neutral[600]};
`;

const TicketNumber = styled.span`
  font-size: 32px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.primary[800]};
  letter-spacing: 1px;
  display: block;
  margin: ${SPACING['4']} 0;
  font-family: ${TYPOGRAPHY.fontFamily.secondary};
`;

const WaitingTimeCard = styled.div`
  background-color: white;
  border-radius: ${BORDER_RADIUS.lg};
  padding: ${SPACING['4']};
  margin: ${SPACING['6']} auto;
  max-width: 80%;
  border: 1px solid ${COLORS.neutral[200]};
  box-shadow: ${SHADOWS.sm};
  transition: all ${ANIMATION.normal} ${EASING.premium};
  
  &:hover {
    box-shadow: ${SHADOWS.md};
    transform: translateY(-2px);
  }
`;

const WaitingTimeText = styled.p`
  color: ${COLORS.neutral[600]};
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${SPACING['2']};
`;

const WaitingTimeValue = styled.strong`
  color: ${COLORS.primary[800]};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
`;

const WaitingTimeIcon = styled.span`
  margin-right: ${SPACING['2']};
  color: ${COLORS.secondary[600]};
`;

const ServiceBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${props => `${props.color}${OPACITY[10]}`};
  padding: ${SPACING['2']} ${SPACING['4']};
  border-radius: ${BORDER_RADIUS.full};
  border: 1px solid ${props => `${props.color}${OPACITY[20]}`};
`;

const ServiceBadgeIcon = styled.span`
  margin-right: ${SPACING['2']};
  color: ${props => props.color};
  font-size: ${TYPOGRAPHY.fontSize.lg};
`;

const ServiceBadgeName = styled.span`
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  color: ${props => props.color};
`;

const SummaryItem = styled.div`
  display: flex;
  padding: ${SPACING['3']} ${SPACING['4']};
  border-radius: ${BORDER_RADIUS.md};
  background-color: ${COLORS.neutral[50]};
  margin-bottom: ${SPACING['3']};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  color: ${COLORS.neutral[700]};
  min-width: 120px;
`;

const SummaryValue = styled.span`
  color: ${COLORS.neutral[900]};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
`;

const TimelineIndicator = styled.div`
  position: absolute;
  left: ${props => props.isMobile ? "16px" : "calc(25% - 16px)"};
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: ${COLORS.neutral[200]};
  z-index: ${Z_INDEX[0]};
  display: ${props => props.isMobile ? "none" : "block"};
`;

const StepIndicatorDot = styled.div`
  position: absolute;
  left: -8px;
  width: 18px;
  height: 18px;
  border-radius: ${BORDER_RADIUS.full};
  background-color: ${props => props.active ? COLORS.primary[800] : props.completed ? COLORS.success[600] : COLORS.neutral[300]};
  border: 3px solid white;
  top: ${props => props.position}%;
  box-shadow: ${SHADOWS.sm};
  z-index: ${Z_INDEX[10]};
  transition: all ${ANIMATION.normal} ${EASING.premium};
`;

const FormSection = styled.div`
  background-color: white;
  border-radius: ${BORDER_RADIUS.lg};
  padding: ${SPACING['6']};
  margin-bottom: ${SPACING['6']};
  box-shadow: ${SHADOWS.sm};
  border: 1px solid ${COLORS.neutral[200]};
`;

const FormSectionTitle = styled.h4`
  color: ${COLORS.neutral[800]};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  margin-bottom: ${SPACING['4']};
  font-size: ${TYPOGRAPHY.fontSize.lg};
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 20px;
    background-color: ${COLORS.primary[800]};
    margin-right: ${SPACING['3']};
    border-radius: ${BORDER_RADIUS.full};
  }
`;

const ResponseTimeInfo = styled.div`
  background-color: ${COLORS.primary[50]};
  border-left: 4px solid ${COLORS.primary[800]};
  padding: ${SPACING['4']};
  border-radius: 0 ${BORDER_RADIUS.md} ${BORDER_RADIUS.md} 0;
  margin: ${SPACING['6']} 0;
  display: flex;
  align-items: center;
`;

const ResponseTimeIcon = styled.div`
  font-size: ${TYPOGRAPHY.fontSize.xl};
  color: ${COLORS.primary[800]};
  margin-right: ${SPACING['3']};
`;

const ResponseTimeText = styled.p`
  margin: 0;
  font-size: ${TYPOGRAPHY.fontSize.md};
  color: ${COLORS.neutral[700]};
`;

const ConfidentialityNote = styled.div`
  background-color: ${COLORS.neutral[50]};
  border-radius: ${BORDER_RADIUS.md};
  padding: ${SPACING['4']};
  margin-top: ${SPACING['4']};
  display: flex;
  align-items: flex-start;
  font-size: ${TYPOGRAPHY.fontSize.sm};
  color: ${COLORS.neutral[600]};
  
  &::before {
    content: '🔒';
    margin-right: ${SPACING['3']};
    font-size: ${TYPOGRAPHY.fontSize.lg};
  }
`;

const QRCode = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${COLORS.neutral[800]};
  margin: ${SPACING['4']} auto;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    background: repeating-conic-gradient(${COLORS.neutral[800]} 0% 25%, white 0% 50%);
    background-size: 8px 8px;
  }
`;

const TicketFooter = styled.div`
  font-size: ${TYPOGRAPHY.fontSize.xs};
  color: ${COLORS.neutral[500]};
  margin-top: ${SPACING['4']};
  text-align: center;
`;

const SuccessCheckmark = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${SPACING['6']};
  border-radius: ${BORDER_RADIUS.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.success[200]};
  color: ${COLORS.success[600]};
  font-size: 40px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: ${BORDER_RADIUS.full};
    border: 2px solid ${COLORS.success[600]};
    animation: ${pulse} 2s infinite;
  }
`;

// ========== SCHÉMA DE VALIDATION ==========

const { StringType } = Schema.Types;

const userDataModel = Schema.Model({
  name: StringType()
    .isRequired('Le nom est obligatoire')
    .minLength(3, 'Le nom doit contenir au moins 3 caractères'),
  phone: StringType()
    .isRequired('Le téléphone est obligatoire')
    .pattern(/^[0-9+\s-]{8,15}$/, 'Numéro de téléphone invalide'),
  email: StringType()
    .isEmail('Email invalide')
});

// ========== COMPOSANT PRINCIPAL ==========

const VerticalTicketWizard = () => {
  // Refs
  const formRef = useRef();
  
  // États principaux
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [ticketNumber, setTicketNumber] = useState('');
  const [waitTime, setWaitTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectionDelay, setSelectionDelay] = useState(false);
  const [formError, setFormError] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showConfidentialityTooltip, setShowConfidentialityTooltip] = useState(false);

  // Media queries pour le responsive design
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isExtraSmall = useMediaQuery('(max-width: 480px)');

  // Liste des services disponibles
  const services = [
    { id: 'information', name: 'Information', description: 'Renseignements généraux et conseil clientèle', color: COLORS.primary[600] },
    { id: 'consultation', name: 'Consultation', description: 'Rencontrer un conseiller financier', color: COLORS.secondary[600] },
    { id: 'paiement', name: 'Paiement', description: 'Effectuer ou recevoir un paiement', color: COLORS.success[600] },
    { id: 'reclamation', name: 'Réclamation', description: 'Déposer une réclamation ou demande particulière', color: COLORS.danger[600] },
    { id: 'livraison', name: 'Livraison', description: 'Retrait de carte bancaire ou chéquier', color: COLORS.warning[600] },
    { id: 'reparation', name: 'Réparation', description: 'Service après-vente et support technique', color: '#1abc9c' }
  ];

  // Effets
  useEffect(() => {
    // Générer un numéro de ticket aléatoire quand on arrive à l'étape finale
    if (step === 3) {
      const randomTicket = `AFG-${Math.floor(Math.random() * 900) + 100}`;
      const randomWait = Math.floor(Math.random() * 20) + 5; // Entre 5 et 25 minutes
      setTicketNumber(randomTicket);
      setWaitTime(randomWait);
    }
  }, [step]);

  // Effet pour la redirection automatique après le modal de succès
  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        handleReset();
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccess]);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Gestionnaires d'événements
  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setSelectionDelay(true);

    // Attendre pour que l'utilisateur voie son choix
    setTimeout(() => {
      setSelectionDelay(false);
      // Puis afficher le loader
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(1);
      }, 500);
    }, 700);
  };

  const handleUserDataChange = (formValue) => {
    setUserData(formValue);
  };

  const handleNext = () => {
    if (step === 1) {
      // Validation du formulaire avant de passer à l'étape suivante
      if (formRef.current && formRef.current.check) {
        const isValid = formRef.current.check();
        if (!isValid) return;
      }
    }

    // Animation de transition
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(step + 1);
    }, 500);
  };

  const handlePrevious = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(step - 1);
    }, 500);
  };

  const handleConfirm = () => {
    setShowSuccess(true);
  };

  const handleReset = () => {
    // Réinitialiser tout le wizard
    setShowSuccess(false);
    setStep(0);
    setSelectedService(null);
    setUserData({ name: '', phone: '', email: '' });
    setFormError({});
  };

  const getSelectedServiceName = () => {
    const service = services.find(s => s.id === selectedService);
    return service ? service.name : '';
  };

  const getSelectedServiceColor = () => {
    const service = services.find(s => s.id === selectedService);
    return service ? service.color : COLORS.primary[800];
  };

  const getProgressPercentage = () => {
    return step * 33.33;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calculer l'heure estimée de prise en charge
  const getEstimatedTime = () => {
    const estimated = new Date(currentTime);
    estimated.setMinutes(estimated.getMinutes() + waitTime);
    return formatTime(estimated);
  };

  // Rendu du contenu en fonction de l'étape actuelle
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px'
        }}>
          <Loader size="lg" content="Chargement..." vertical />
        </div>
      );
    }

    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <div>
              <SectionHeading color={COLORS.primary[800]}>
                Sélectionnez le service souhaité
              </SectionHeading>
              <SectionDescription>
                Choisissez parmi nos services bancaires ci-dessous pour obtenir un ticket et être pris en charge par un conseiller AFG Bank.
              </SectionDescription>
              
              <Grid fluid>
                <Row gutter={isMobile ? 10 : 20}>
                  {services.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <Col xs={24} sm={12} md={8} key={service.id} style={{ marginBottom: SPACING['4'] }}>
                        <ServiceCard 
                          isSelected={isSelected}
                          selectionDelay={selectionDelay}
                          color={service.color}
                          onClick={() => !selectionDelay && handleServiceSelect(service.id)}
                          role="button"
                          aria-pressed={isSelected}
                          aria-label={`Service ${service.name}: ${service.description}`}
                          tabIndex={0}
                        >
                          {isSelected && <CheckMark color={service.color}>✓</CheckMark>}
                          <ServiceIcon isSelected={isSelected} color={service.color}>
                            {SERVICE_ICONS[service.id]}
                          </ServiceIcon>
                          <ServiceName isSelected={isSelected} color={service.color}>
                            {service.name}
                          </ServiceName>
                          <ServiceDescription>
                            {service.description}
                          </ServiceDescription>
                        </ServiceCard>
                      </Col>
                    );
                  })}
                </Row>
              </Grid>

              <ResponseTimeInfo>
                <ResponseTimeIcon>⏱️</ResponseTimeIcon>
                <ResponseTimeText>
                  Temps d'attente moyen actuel : <strong>7 minutes</strong>
                </ResponseTimeText>
              </ResponseTimeInfo>

              {selectedService && !selectionDelay && (
                <ButtonsContainer>
                  <PrimaryButton
                    appearance="primary"
                    onClick={handleNext}
                    style={{
                      backgroundColor: getSelectedServiceColor(),
                      borderColor: getSelectedServiceColor()
                    }}
                  >
                    Continuer
                  </PrimaryButton>
                </ButtonsContainer>
              )}
            </div>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <div>
              <SectionHeading color={getSelectedServiceColor()}>
                Vos informations
              </SectionHeading>
              <SectionDescription>
                Veuillez renseigner vos coordonnées afin que nous puissions vous appeler lorsque votre tour sera venu.
              </SectionDescription>

              <Form 
                fluid 
                ref={formRef}
                formValue={userData}
                onChange={handleUserDataChange}
                model={userDataModel}
              >
                <FormSection>
                  <FormSectionTitle>Informations personnelles</FormSectionTitle>
                  <Form.Group>
                    <Form.ControlLabel>Nom complet*</Form.ControlLabel>
                    <Form.Control 
                      name="name"
                      placeholder="Entrez votre nom et prénom"
                    />
                    <Form.HelpText>Tel qu'il apparaît sur votre pièce d'identité</Form.HelpText>
                  </Form.Group>
                  
                  <Divider />
                  
                  <FormSectionTitle>Coordonnées</FormSectionTitle>
                  <Form.Group>
                    <Form.ControlLabel>Téléphone mobile*</Form.ControlLabel>
                    <Form.Control
                      name="phone"
                      placeholder="Ex: 0612345678"
                    />
                    <Form.HelpText>Nous vous appellerons à ce numéro</Form.HelpText>
                  </Form.Group>
                  <Form.Group>
                    <Form.ControlLabel>Email (optionnel)</Form.ControlLabel>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                    />
                    <Form.HelpText>Pour recevoir une confirmation de votre ticket</Form.HelpText>
                  </Form.Group>
                </FormSection>

                <Whisper
                  placement="top"
                  trigger="hover"
                  speaker={<Tooltip>Vos données personnelles sont protégées conformément à notre politique de confidentialité.</Tooltip>}
                >
                  <ConfidentialityNote>
                    Les informations recueillies sont utilisées uniquement pour la gestion de votre ticket et ne seront pas conservées au-delà de votre visite.
                  </ConfidentialityNote>
                </Whisper>
              </Form>

              <ButtonsContainer position="space-between">
                <SecondaryButton
                  appearance="subtle"
                  onClick={handlePrevious}
                >
                  Retour
                </SecondaryButton>
                <PrimaryButton
                  appearance="primary"
                  onClick={handleNext}
                  style={{
                    backgroundColor: getSelectedServiceColor(),
                    borderColor: getSelectedServiceColor()
                  }}
                >
                  Continuer
                </PrimaryButton>
              </ButtonsContainer>
            </div>
          </Fade>
        );

      case 2:
        return (
          <Fade in={true}>
            <div>
              <SectionHeading color={getSelectedServiceColor()}>
                Résumé de votre demande
              </SectionHeading>
              <SectionDescription>
                Veuillez vérifier les informations suivantes avant de confirmer votre demande de ticket.
              </SectionDescription>

              <FormSection>
                <FormSectionTitle>Détails de votre demande</FormSectionTitle>
                
                <SummaryItem>
                  <SummaryLabel>Service :</SummaryLabel>
                  <SummaryValue>
                    <ServiceBadge color={getSelectedServiceColor()}>
                      <ServiceBadgeIcon color={getSelectedServiceColor()}>
                        {SERVICE_ICONS[selectedService]}
                      </ServiceBadgeIcon>
                      <ServiceBadgeName color={getSelectedServiceColor()}>
                        {getSelectedServiceName()}
                      </ServiceBadgeName>
                    </ServiceBadge>
                  </SummaryValue>
                </SummaryItem>
                
                <SummaryItem>
                  <SummaryLabel>Nom :</SummaryLabel>
                  <SummaryValue>{userData.name}</SummaryValue>
                </SummaryItem>
                
                <SummaryItem>
                  <SummaryLabel>Téléphone :</SummaryLabel>
                  <SummaryValue>{userData.phone}</SummaryValue>
                </SummaryItem>
                
                {userData.email && (
                  <SummaryItem>
                    <SummaryLabel>Email :</SummaryLabel>
                    <SummaryValue>{userData.email}</SummaryValue>
                  </SummaryItem>
                )}
                
                <SummaryItem>
                  <SummaryLabel>Date :</SummaryLabel>
                  <SummaryValue>{formatDate(currentTime)}</SummaryValue>
                </SummaryItem>
                
                <SummaryItem>
                  <SummaryLabel>Heure :</SummaryLabel>
                  <SummaryValue>{formatTime(currentTime)}</SummaryValue>
                </SummaryItem>
              </FormSection>

              <Message
                showIcon
                type="warning"
                style={{ marginTop: SPACING['6'] }}
              >
                Après confirmation, un ticket sera généré et vous serez appelé(e) à votre tour. Merci de rester à proximité.
              </Message>

              <ButtonsContainer position="space-between">
                <SecondaryButton
                  appearance="subtle"
                  onClick={handlePrevious}
                >
                  Modifier
                </SecondaryButton>
                <PrimaryButton
                  appearance="primary"
                  color="green"
                  onClick={handleNext}
                  style={{
                    backgroundColor: COLORS.success[600],
                    borderColor: COLORS.success[600]
                  }}
                >
                  Confirmer ma demande
                </PrimaryButton>
              </ButtonsContainer>
            </div>
          </Fade>
        );

      case 3:
        return (
          <Fade in={true}>
            <TicketContainer>
              <SuccessCheckmark>✓</SuccessCheckmark>
              
              <TicketTitle>
                Votre ticket est prêt !
              </TicketTitle>

              <TicketCard>
                <BankLogo>AFG BANK</BankLogo>
                <TicketLabel>
                  Votre numéro de ticket est :
                </TicketLabel>
                <TicketNumber>
                  {ticketNumber}
                </TicketNumber>
                
                <QRCode />
                
                <TicketFooter>
                  AFG Bank Côte d'Ivoire • {formatDate(currentTime)}
                </TicketFooter>
              </TicketCard>

              <p style={{ fontSize: TYPOGRAPHY.fontSize.md, margin: `${SPACING['6']} 0`, color: COLORS.neutral[700] }}>
                Veuillez patienter dans notre espace d'attente. Un conseiller vous appellera bientôt.
              </p>

              <WaitingTimeCard>
                <WaitingTimeText>
                  <WaitingTimeIcon>⏱️</WaitingTimeIcon>
                  Temps d'attente estimé :
                  <WaitingTimeValue>
                    environ {waitTime} minutes
                  </WaitingTimeValue>
                </WaitingTimeText>
                <Divider style={{ margin: `${SPACING['3']} 0` }} />
                <WaitingTimeText>
                  <WaitingTimeIcon>🕒</WaitingTimeIcon>
                  Heure estimée de prise en charge :
                  <WaitingTimeValue>
                    {getEstimatedTime()}
                  </WaitingTimeValue>
                </WaitingTimeText>
              </WaitingTimeCard>

              <Message showIcon type="info" style={{ marginTop: SPACING['6'], textAlign: 'left' }}>
                Si vous avez fourni une adresse email, une copie de votre ticket y a été envoyée.
              </Message>

              <ButtonsContainer position="center">
                <PrimaryButton
                  appearance="primary"
                  onClick={handleConfirm}
                  style={{
                    marginTop: SPACING['6'],
                    backgroundColor: COLORS.success[600],
                    borderColor: COLORS.success[600],
                    padding: '10px 20px',
                    fontSize: TYPOGRAPHY.fontSize.md
                  }}
                >
                  Terminer
                </PrimaryButton>
              </ButtonsContainer>
            </TicketContainer>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <GlobalStyle />
      <WizardContainer isMobile={isMobile}>
        <WizardHeaderSection>
          <LogoContainer>
            <AFGBankLogo>AFG BANK CÔTE D'IVOIRE</AFGBankLogo>
          </LogoContainer>
          <WizardTitle isMobile={isMobile}>
            Service de File d'Attente
          </WizardTitle>
          <WizardSubtitle>
            Bienvenue dans notre système de gestion des files d'attente. Suivez les étapes pour obtenir votre ticket et être pris en charge par nos conseillers.
          </WizardSubtitle>
        </WizardHeaderSection>

        <WizardLayout isMobile={isMobile}>
          {/* Timeline indicator */}
          <TimelineIndicator isMobile={isMobile}>
            <StepIndicatorDot position={16.66} completed={step > 0} active={step === 0} />
            <StepIndicatorDot position={50} completed={step > 1} active={step === 1} />
            <StepIndicatorDot position={83.33} completed={step > 2} active={step === 2} />
          </TimelineIndicator>
          
          {/* Wizard Steps - Vertical pour écran large, Horizontal pour petit écran */}
          <StepsContainer isMobile={isMobile}>
            <StepsPanel>
              <Steps
                current={step}
                vertical={!isMobile} // Vertical pour ordinateur, horizontal pour mobile
                small={isExtraSmall} // Petite taille pour les très petits écrans
              >
                <Steps.Item
                  title="Service"
                  description={isMobile ? "" : "Choisissez votre service"}
                  style={{ color: step === 0 ? getSelectedServiceColor() : undefined }}
                />
                <Steps.Item
                  title="Informations"
                  description={isMobile ? "" : "Vos coordonnées"}
                  style={{ color: step === 1 ? getSelectedServiceColor() : undefined }}
                />
                <Steps.Item
                  title="Résumé"
                  description={isMobile ? "" : "Vérification"}
                  style={{ color: step === 2 ? getSelectedServiceColor() : undefined }}
                />
                <Steps.Item
                  title="Ticket"
                  description={isMobile ? "" : "Confirmation"}
                  style={{ color: step === 3 ? getSelectedServiceColor() : undefined }}
                />
              </Steps>

              {/* Indicateur de progression pour tous les écrans */}
              <ProgressIndicator>
                <Progress.Line 
                  percent={getProgressPercentage()} 
                  strokeColor={getSelectedServiceColor()} 
                  showInfo={false}
                />
                <StepIndicator>
                  <StepNumber>
                    Étape {step + 1} sur 4
                  </StepNumber>
                  <StepName color={getSelectedServiceColor()}>
                    {step === 0 && 'Choix du service'}
                    {step === 1 && 'Saisie des informations'}
                    {step === 2 && 'Vérification'}
                    {step === 3 && 'Génération du ticket'}
                  </StepName>
                </StepIndicator>
              </ProgressIndicator>
              
              {/* Information sur la date et l'heure actuelles */}
              <div style={{ 
                textAlign: 'center', 
                fontSize: TYPOGRAPHY.fontSize.sm,
                color: COLORS.neutral[600],
                marginTop: SPACING['6'],
                display: isMobile ? 'none' : 'block'
              }}>
                {formatDate(currentTime)} | {formatTime(currentTime)}
              </div>
            </StepsPanel>
          </StepsContainer>

          {/* Contenu principal */}
          <ContentContainer isMobile={isMobile}>
            <ContentPanel bordered isMobile={isMobile}>
              {renderStepContent()}
            </ContentPanel>
          </ContentContainer>
        </WizardLayout>

        {/* Modal de confirmation */}
        <Modal
          open={showSuccess}
          onClose={handleReset}
          size="xs"
        >
          <Modal.Header>
            <Modal.Title>Merci pour votre visite</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ textAlign: 'center', padding: `${SPACING['6']} 0` }}>
              <div style={{
                fontSize: '50px',
                marginBottom: SPACING['6'],
                color: COLORS.success[600]
              }}>
                🎉
              </div>
              <p style={{ fontSize: TYPOGRAPHY.fontSize.md, marginBottom: SPACING['4'] }}>
                Votre demande a bien été enregistrée. Merci d'avoir utilisé notre service de tickets !
              </p>
              <p style={{
                fontSize: TYPOGRAPHY.fontSize.sm,
                marginTop: SPACING['4'],
                color: COLORS.neutral[600],
                fontStyle: 'italic'
              }}>
                Redirection automatique dans 3 secondes...
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button appearance="primary" onClick={handleReset} block style={{
              backgroundColor: COLORS.primary[800],
              borderColor: COLORS.primary[800]
            }}>
              Nouveau ticket
            </Button>
          </Modal.Footer>
        </Modal>
      </WizardContainer>
    </>
  );
};

export default VerticalTicketWizard;