<?php
/**
 * Frontend class for managing frontend interface
 *
 * @package SG_AI_Studio
 */

namespace SG_AI_Studio\Frontend;

use SG_AI_Studio;
use SG_AI_Studio\Helper\Helper;
use SG_AI_Studio\Vendor\SiteGround_i18n\i18n_Service;

/**
 * Handle all hooks for frontend AI chat integration.
 */
class Frontend {

	/**
	 * Register the JavaScript for the frontend area.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function enqueue_scripts() {
		global $wp_version;

		// Bail if not on frontend or user is not an administrator.
		if ( is_admin() || ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Enqueue the chat script.
		wp_enqueue_script(
			'siteground-ai-studio-chat',
			\SG_AI_Studio\URL . '/assets/js/chat.js',
			array( 'jquery' ),
			\SG_AI_Studio\VERSION,
			true
		);

		// Get user ID for transient.
		$user_id = get_current_user_id();

		// Get thread_id from request or from user-specific transient.
		$thread_id = get_transient( 'sg_ai_studio_thread_id_' . $user_id );

		// This function is required to check for active plugins.
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		// Check if WooCommerce is active to provide contextual suggestions.
		if ( is_plugin_active( 'woocommerce/woocommerce.php' ) ) {
			// --- WOOCOMMERCE-SPECIFIC WELCOME MESSAGE ---
			$welcome_message_string = __(
				"**Hi! I am your WordPress AI Assistant. How can I help you manage your store today?**",
				'sg-ai-studio'
			);
		} else {
			// --- STANDARD WORDPRESS WELCOME MESSAGE ---
			$welcome_message_string = __(
				"**Hi! I am your WordPress AI Assistant. How can I help you manage your site today?**",
				'sg-ai-studio'
			);
		}

		// Create i18n service instance.
		$i18n_service = new i18n_Service( 'sg-ai-studio' );

		// Localize the script with necessary data.
		wp_localize_script(
			'siteground-ai-studio-chat',
			'WPAIStudioConfig',
			array(
				'config'       => array(
					'home_url'         => get_home_url(),
					'rest_base'        => rtrim( esc_url_raw( rest_url() ), '/' ),
					'threadId'         => $thread_id,
					'localeSlug'       => join( '-', explode( '_', \get_user_locale() ) ),
					'locale'           => $i18n_service->get_i18n_data_json(),
					'wp_nonce'         => wp_create_nonce( 'wp_rest' ),
					'assetsPath'       => \SG_AI_Studio\URL . '/assets/',
					'is_staging'       => Helper::is_staging_environment(),
					'welcome_msg'      => $welcome_message_string,
					'minimizeOverride' => false, // Always start minimized on frontend.
					'plugin_version'   => \SG_AI_Studio\VERSION,
					'wp_version'       => $wp_version,
					'chat_bubble_fe_hidden' => (bool) get_option( 'sg_ai_studio_chat_bubble_fe_hidden', false ),
					'defaultDisplayMode'      => get_option( 'sg_ai_studio_chat_display_mode_frontend', 'popover' ),
					'chatSource'       => 'wp_frontend_chatbox',
					'quickActions'     => array(
						'categories'   => array(
							array(
								'type'  => 'most-popular',
								'title' => __( 'Most Popular', 'sg-ai-studio' ),
								'icon'  => 'star',
							),
							array(
								'type'  => 'create-and-generate',
								'title' => __( 'Create & Generate', 'sg-ai-studio' ),
								'icon'  => 'edit_square',
							),
							array(
								'type'  => 'audit-and-ptimize',
								'title' => __( 'Audit & Optimize', 'sg-ai-studio' ),
								'icon'  => 'trending_up',
							),
							array(
								'type'  => 'bulk-actions',
								'title' => __( 'Bulk Actions', 'sg-ai-studio' ),
								'icon'  => 'check_box',
							),
						),
						'actions'      => array(
							'most-popular'        => array(
								__( 'Write a SEO-friendly blog post with AI images and headings', 'sg-ai-studio' ),
								__( 'Speed up my site automatically (with SiteGround Speed Optimizer)', 'sg-ai-studio' ),
								__( 'Generate sales report for last week including best selling products', 'sg-ai-studio' ),
							),
							'create-and-generate' => array(
								__( 'Write a blog post with images and SEO', 'sg-ai-studio' ),
								__( 'Create a new page from scratch (with Gutenberg building blocks)', 'sg-ai-studio' ),
								__( 'Generate product descriptions (for WooCommerce)', 'sg-ai-studio' ),
								__( 'Create 10 blog post title ideas', 'sg-ai-studio' ),
							),
							'audit-and-ptimize'   => array(
								__( 'Speed - Optimize site performance (caching, images, CSS via SiteGround Speed Optimizer)', 'sg-ai-studio' ),
								__( 'Security - Check site security status (via Security Optimizer)', 'sg-ai-studio' ),
								__( 'Run full SEO audit of my site', 'sg-ai-studio' ),
								__( 'Check if my site, plugins and themes are up-to-date', 'sg-ai-studio' ),
							),
							'bulk-actions'        => array(
								__( 'Create 5 blog post drafts at once', 'sg-ai-studio' ),
								__( 'Apply a 20% discount to all products in category (keeping Regular price unchanged)', 'sg-ai-studio' ),
								__( 'Delete all spam comments', 'sg-ai-studio' ),
								__( 'Create 3 new parent post categories with 5 sub-categories for each', 'sg-ai-studio' ),
							),
						),
						'actionsTitle' => __( 'Suggested actions', 'sg-ai-studio' ),
					),
				),
				'page'         => 'chat',
				'domElementId' => 'wp-ai-studio-container',
			)
		);

		wp_enqueue_media();
	}

	/**
	 * Add floating chat widget to frontend footer
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function add_floating_chat() {
		// Only show for users who can manage options on frontend.
		if ( is_admin() || ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$api_key = get_option( 'sg_ai_studio_api_key', '' );

		wp_add_inline_script(
			'siteground-ai-studio-chat',
			'jQuery( document ).ready(function() {WPAIStudioChat.init(WPAIStudioConfig);});',
			'after'
		);

		?>
		<div id="wp-ai-studio-container" class="sg-ai-floating-chat <?php echo empty( $api_key ) ? 'no-api-key' : ''; ?>"></div>
		<?php
	}
}
